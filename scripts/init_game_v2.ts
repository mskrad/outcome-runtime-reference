import path from "path";
import {
  defaultCompiledPath,
  ensureArg,
  getArgValue,
  randomGameIdHex,
  runCoreYarn,
} from "./common.ts";

function main() {
  let args = process.argv.slice(2);
  const compiledPath = path.resolve(
    getArgValue(args, "--compiled") ||
      process.env.COMPILED_SPEC_PATH ||
      defaultCompiledPath()
  );
  const gameIdHex =
    getArgValue(args, "--game-id") ||
    getArgValue(args, "--game-id-hex") ||
    process.env.GAME_ID_HEX ||
    randomGameIdHex();
  const seed = getArgValue(args, "--seed") || process.env.MASTER_SEED_HEX || "00".repeat(32);

  args = ensureArg(args, "--compiled", compiledPath);
  args = ensureArg(args, "--game-id", gameIdHex);
  args = ensureArg(args, "--seed", seed);

  console.log("[outcome-runtime] init game_id:", gameIdHex);
  runCoreYarn("init:game:v2", args);
  console.log("[outcome-runtime] GAME_ID_HEX:", gameIdHex);
}

main();
