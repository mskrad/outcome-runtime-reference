import { ensureArg, getArgValue, runCoreYarn } from "./common.ts";

function main() {
  let args = process.argv.slice(2);
  const sig = getArgValue(args, "--sig") || process.env.SIG;
  if (!sig) {
    throw new Error("Missing signature (pass --sig or env SIG)");
  }

  args = ensureArg(args, "--sig", sig);
  if (!args.includes("--no-java")) args.push("--no-java");

  console.log("[reference-slot] replay sig:", sig);
  runCoreYarn("replay:v2", args);
}

main();
