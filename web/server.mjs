import http from "http";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CORE_SLOT_DIR = process.env.CORE_SLOT_DIR
  ? path.resolve(process.env.CORE_SLOT_DIR)
  : path.join(REPO_ROOT, "core", "contracts", "slot");
const STATIC_DIR = path.join(__dirname, "public");
const DEFAULT_COMPILED_PATH = path.join(REF_ROOT, "artifacts", "compiled_spec_v2.json");
const DEFAULT_METRICS_PATH = path.join(REF_ROOT, "artifacts", "metrics.json");

function loadEnvFile() {
  const p = path.join(REF_ROOT, ".env");
  if (!fs.existsSync(p)) return;
  const rows = fs.readFileSync(p, "utf8").split(/\r?\n/);
  for (const row of rows) {
    const line = row.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile();

function json(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve(text ? JSON.parse(text) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function runCore(scriptName, args = [], extraEnv = {}) {
  if (!fs.existsSync(CORE_SLOT_DIR)) {
    throw new Error(`core slot dir not found: ${CORE_SLOT_DIR}`);
  }
  const env = {
    ...process.env,
    ...extraEnv,
  };
  const out = spawnSync("yarn", ["-s", scriptName, ...args], {
    cwd: CORE_SLOT_DIR,
    env,
    encoding: "utf8",
  });
  const stdout = out.stdout || "";
  const stderr = out.stderr || "";
  const text = [stdout, stderr].filter(Boolean).join("\n");
  if (out.status !== 0) {
    const err = new Error(`${scriptName} failed with code ${out.status}`);
    err.details = text;
    throw err;
  }
  return text;
}

function parseKeyValueOutput(text) {
  const obj = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    obj[key] = value;
  }
  return obj;
}

function ensureCompiledPath(input) {
  if (!input || input.length === 0) return DEFAULT_COMPILED_PATH;
  if (path.isAbsolute(input)) return input;
  return path.resolve(REF_ROOT, input);
}

function sendStatic(req, res, pathname) {
  const localPath = pathname === "/" ? "/index.html" : pathname;
  const abs = path.join(STATIC_DIR, localPath.replace(/^\/+/, ""));
  if (!abs.startsWith(STATIC_DIR)) {
    json(res, 400, { ok: false, error: "invalid path" });
    return;
  }
  if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
    json(res, 404, { ok: false, error: "not found" });
    return;
  }
  const ext = path.extname(abs).toLowerCase();
  const contentType =
    ext === ".html"
      ? "text/html; charset=utf-8"
      : ext === ".js"
      ? "text/javascript; charset=utf-8"
      : ext === ".css"
      ? "text/css; charset=utf-8"
      : "application/octet-stream";
  const data = fs.readFileSync(abs);
  res.writeHead(200, {
    "content-type": contentType,
    "content-length": data.length,
  });
  res.end(data);
}

function defaultRpc(cluster) {
  if (cluster === "devnet") return "https://api.devnet.solana.com";
  if (cluster === "mainnet") return "https://api.mainnet-beta.solana.com";
  return "http://127.0.0.1:8899";
}

async function handleApi(req, res, pathname) {
  try {
    if (req.method === "GET" && pathname === "/api/health") {
      json(res, 200, {
        ok: true,
        core_slot_dir: CORE_SLOT_DIR,
        compiled_path: DEFAULT_COMPILED_PATH,
        wallet: process.env.ANCHOR_WALLET || null,
        rpc: process.env.ANCHOR_PROVIDER_URL || null,
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/spec") {
      const compiled = JSON.parse(fs.readFileSync(DEFAULT_COMPILED_PATH, "utf8"));
      const metrics = fs.existsSync(DEFAULT_METRICS_PATH)
        ? JSON.parse(fs.readFileSync(DEFAULT_METRICS_PATH, "utf8"))
        : null;
      const binPath = path.join(REF_ROOT, "artifacts", "compiled_spec_v2.bin");
      const blobLen = fs.existsSync(binPath) ? fs.statSync(binPath).size : null;
      json(res, 200, {
        ok: true,
        compiled,
        metrics,
        blob_len: blobLen,
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/init") {
      const body = await readJsonBody(req);
      const cluster = body.cluster || "localnet";
      const wallet = body.wallet || process.env.ANCHOR_WALLET || "";
      const rpc = body.rpc || defaultRpc(cluster);
      const compiledPath = ensureCompiledPath(body.compiledPath);
      const gameIdHex = body.gameIdHex || "";
      const seed = body.masterSeedHex || "00".repeat(32);
      const args = [
        "--cluster",
        cluster,
        "--compiled",
        compiledPath,
        "--seed",
        seed,
      ];
      if (gameIdHex) args.push("--game-id", gameIdHex);
      const out = runCore("init:game:v2", args, {
        ANCHOR_PROVIDER_URL: rpc,
        ANCHOR_WALLET: wallet,
      });
      const kv = parseKeyValueOutput(out);
      json(res, 200, {
        ok: true,
        output: out,
        game_id_hex: kv["GAME_ID_HEX"] || null,
        init_signature: kv["init sig"] || null,
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/spin") {
      const body = await readJsonBody(req);
      const cluster = body.cluster || "localnet";
      const wallet = body.wallet || process.env.ANCHOR_WALLET || "";
      const rpc = body.rpc || defaultRpc(cluster);
      const gameIdHex = (body.gameIdHex || "").toString();
      const betLamports = String(body.betLamports || 1000);
      if (!gameIdHex) {
        json(res, 400, { ok: false, error: "gameIdHex is required" });
        return;
      }
      const spinOut = runCore(
        "spin:v2",
        ["--cluster", cluster, "--game-id", gameIdHex, "--bet", betLamports],
        {
          ANCHOR_PROVIDER_URL: rpc,
          ANCHOR_WALLET: wallet,
          GAME_ID_HEX: gameIdHex,
          BET_LAMPORTS: betLamports,
        }
      );
      const sigMatch = spinOut.match(/signature:\s*([1-9A-HJ-NP-Za-km-z]+)/);
      const signature = sigMatch ? sigMatch[1] : null;
      let replayOut = "";
      let replayKv = {};
      if (signature) {
        replayOut = runCore(
          "replay:v2",
          ["--cluster", cluster, "--sig", signature, "--no-java"],
          {
            ANCHOR_PROVIDER_URL: rpc,
            SIG: signature,
          }
        );
        replayKv = parseKeyValueOutput(replayOut);
      }
      json(res, 200, {
        ok: true,
        signature,
        spin_output: spinOut,
        replay_output: replayOut,
        replay: replayKv,
      });
      return;
    }

    if (req.method === "POST" && pathname === "/api/replay") {
      const body = await readJsonBody(req);
      const cluster = body.cluster || "localnet";
      const rpc = body.rpc || defaultRpc(cluster);
      const sig = (body.signature || body.sig || "").toString();
      if (!sig) {
        json(res, 400, { ok: false, error: "signature is required" });
        return;
      }
      const replayOut = runCore(
        "replay:v2",
        ["--cluster", cluster, "--sig", sig, "--no-java"],
        {
          ANCHOR_PROVIDER_URL: rpc,
          SIG: sig,
        }
      );
      const kv = parseKeyValueOutput(replayOut);
      json(res, 200, { ok: true, replay_output: replayOut, replay: kv });
      return;
    }

    json(res, 404, { ok: false, error: "api route not found" });
  } catch (e) {
    json(res, 500, {
      ok: false,
      error: e.message || String(e),
      details: e.details || null,
    });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url.pathname);
    return;
  }
  sendStatic(req, res, url.pathname);
});

const port = Number(process.env.PORT || 8787);
server.listen(port, "127.0.0.1", () => {
  console.log(`[reference-slot:web] listening on http://127.0.0.1:${port}`);
});
