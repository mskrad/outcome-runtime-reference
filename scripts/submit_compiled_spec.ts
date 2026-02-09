import path from "path";
import {
  defaultCompiledPath,
  ensureArg,
  getArgValue,
  runCoreYarn,
} from "./common.ts";

function main() {
  const passthrough = process.argv.slice(2);
  const fromArg = getArgValue(passthrough, "--compiled");
  const fromEnv = process.env.COMPILED_SPEC_PATH;
  const compiledPath = path.resolve(fromArg || fromEnv || defaultCompiledPath());

  const args = ensureArg(passthrough, "--compiled", compiledPath);
  console.log("[outcome-runtime] submit compiled:", compiledPath);
  runCoreYarn("submit:compiled:v2", args);
}

main();
