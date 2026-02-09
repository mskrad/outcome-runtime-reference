import {
  defaultCompiledPath,
  ensureArg,
  getArgValue,
  loadCompiledArtifact,
  runCoreYarn,
} from "./common.ts";

function main() {
  let args = process.argv.slice(2);
  const compiledPath = getArgValue(args, "--compiled") || defaultCompiledPath();
  const artifact = loadCompiledArtifact(compiledPath);

  const hash =
    getArgValue(args, "--hash") ||
    process.env.COMPILED_SPEC_HASH_HEX ||
    artifact.compiled_spec_hash;
  const status = getArgValue(args, "--status") || process.env.STATUS || "approved";

  args = ensureArg(args, "--hash", hash);
  args = ensureArg(args, "--status", status);

  console.log("[reference-slot] approve hash:", hash);
  console.log("[reference-slot] status:", status);
  runCoreYarn("review:compiled:v2", args);
}

main();
