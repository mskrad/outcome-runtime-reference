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
  const bet = getArgValue(args, "--bet") || process.env.BET_LAMPORTS || "1000";

  args = ensureArg(args, "--game-id", gameId);
  args = ensureArg(args, "--bet", bet);

  console.log("[reference-slot] spin game_id:", gameId, "bet:", bet);
  runCoreYarn("spin:v2", args);
}

main();
