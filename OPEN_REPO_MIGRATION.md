# Open Repo Migration Plan (Grant Track)

This document describes how to move `reference-slot/` into the standalone public repository `outcome-runtime-reference`.

## 1) Scope to move

Move only:
- `reference-slot/artifacts/*`
- `reference-slot/scripts/*`
- `reference-slot/web/*`
- `reference-slot/README.md`
- `reference-slot/RUNBOOK.md`
- `reference-slot/.env.example`
- `reference-slot/package.json`
- `reference-slot/tsconfig.json`

Do not move:
- full monorepo internals,
- marketplace/platform modules,
- Studio-specific feature surface.

## 2) Choose repository mode

Two valid modes:

1. Wrapper mode (current, staging)
- scripts call core tools from local monorepo checkout,
- acceptable for internal validation only.

2. Standalone mode (required for public grant demo)
- copy minimal runtime scripts and utils from `core/contracts/slot/scripts`,
- remove wrapper dependency on monorepo commands.

Public repo must use Standalone mode.

## 3) Standalone migration checklist

1. Create repository: `outcome-runtime-reference` (public).
2. Copy current `reference-slot/` tree.
3. Add dependencies in new repo:
- `@coral-xyz/anchor`
- `@solana/web3.js`
- `ts-node`
- `typescript`
4. Replace wrapper calls in `scripts/common.ts`:
- remove `runCoreYarn(...)` dependency on monorepo,
- call local scripts directly.
5. Copy minimal required local scripts from core:
- `cli_args.ts`
- `v2Sdk.ts`
- `submit_compiled_spec_v2` logic
- `review_compiled_spec_v2` logic
- `init_slot_game_v2` logic
- `devnet_spin_v2` logic (semantic alias: resolve outcome)
- `replay_v2` logic + `lib/replay_core_v2.ts`
6. Freeze `PROGRAM_ID` and supported cluster in README.
7. Add CI smoke:
- syntax check scripts,
- static web health endpoint check.
8. Publish and pin tag `v0.1.0-reference`.

## 4) Required reviewer experience

Reviewer must be able to:
1. open `Resolve` page,
2. execute one on-chain resolve,
3. verify by tx signature in `Verify` page,
4. see `MATCH` from local trustless recompute,
5. inspect frozen hashes on `Spec` page.

Target: under 3 minutes.

## 5) Grant-ready hard requirements

- exactly one frozen deterministic artifact,
- deterministic replay via RPC only,
- no backend truth dependency,
- infra-first wording in docs.

## 6) Suggested repo metadata

- repository name: `outcome-runtime-reference`
- short description:
  `Deterministic on-chain outcome runtime reference with trustless replay verification (Solana, CompiledSpec v2).`
- license: MIT
