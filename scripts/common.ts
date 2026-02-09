import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CompiledArtifact = {
  compiled_spec_hash: string;
};

export function referenceRoot(): string {
  return path.resolve(__dirname, "..");
}

export function repoRoot(): string {
  const start = path.resolve(__dirname, "..", "..");
  let dir = start;
  for (let i = 0; i < 12; i++) {
    if (
      fs.existsSync(path.join(dir, "core", "contracts", "slot")) &&
      (fs.existsSync(path.join(dir, "reference-slot")) ||
        fs.existsSync(path.join(dir, "outcome-runtime-reference")))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("Failed to locate monorepo root");
}

export function coreSlotDir(): string {
  const fromEnv = process.env.CORE_SLOT_DIR;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  const d = path.join(repoRoot(), "core", "contracts", "slot");
  if (!fs.existsSync(d)) {
    throw new Error(
      "core/contracts/slot not found. Set CORE_SLOT_DIR for standalone mode."
    );
  }
  return d;
}

export function defaultCompiledPath(): string {
  const local = path.join(referenceRoot(), "artifacts", "compiled_spec_v2.json");
  if (fs.existsSync(local)) return local;
  return path.join(
    repoRoot(),
    "docs",
    "gamespec",
    "compiled",
    "demo_5x3_v1.compiled_v2.json"
  );
}

export function loadCompiledArtifact(compiledPath: string): CompiledArtifact {
  if (!fs.existsSync(compiledPath)) {
    throw new Error(`Compiled artifact not found: ${compiledPath}`);
  }
  return JSON.parse(fs.readFileSync(compiledPath, "utf8")) as CompiledArtifact;
}

export function getArgValue(argv: string[], name: string): string | undefined {
  const idx = argv.indexOf(name);
  if (idx >= 0 && idx + 1 < argv.length) return argv[idx + 1];
  return undefined;
}

export function hasFlag(argv: string[], name: string): boolean {
  return argv.includes(name);
}

export function ensureArg(argv: string[], name: string, value: string): string[] {
  if (hasFlag(argv, name)) return argv;
  return [...argv, name, value];
}

export function randomGameIdHex(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function runCoreYarn(
  scriptName: string,
  args: string[],
  extraEnv?: Record<string, string>
): string {
  const env = {
    ...process.env,
    ...(extraEnv || {}),
  } as Record<string, string>;
  const result = spawnSync("yarn", ["-s", scriptName, ...args], {
    cwd: coreSlotDir(),
    env,
    encoding: "utf8",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`${scriptName} failed with code ${result.status}`);
  }
  return `${result.stdout || ""}\n${result.stderr || ""}`;
}
