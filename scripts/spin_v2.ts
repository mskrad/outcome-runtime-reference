import { ensureArg, getArgValue, runCoreYarn } from "./common.ts";

function main() {
  let args = process.argv.slice(2);
  const gameId =
    getArgValue(args, "--game-id") ||
    getArgValue(args, "--game-id-hex") ||
    process.env.GAME_ID_HEX;
  if (!gameId) {
    throw new Error("Missing GAME_ID_HEX (pass --game-id or env GAME_ID_HEX)");
  }
  const inputAmount =
    getArgValue(args, "--input") ||
    getArgValue(args, "--bet") ||
    process.env.INPUT_LAMPORTS ||
    process.env.BET_LAMPORTS ||
    "1000";

  args = ensureArg(args, "--game-id", gameId);
  args = ensureArg(args, "--bet", inputAmount);

  console.log("[outcome-runtime] resolve game_id:", gameId, "input_lamports:", inputAmount);
  runCoreYarn("spin:v2", args);
}

main();
