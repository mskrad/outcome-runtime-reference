# Open Repo Migration Plan (for Solana Grant submission)

This document describes how to move `reference-slot/` into a standalone public repository.

## 1) Scope to move

Move only:
- `reference-slot/artifacts/*`
- `reference-slot/scripts/*`
- `reference-slot/web/*`
- `reference-slot/README.md`
- `reference-slot/REVIEWER_RUNBOOK.md`
- `reference-slot/.env.example`
- `reference-slot/package.json`
- `reference-slot/tsconfig.json`

Do not move:
- full monorepo internals,
- marketplace/platform modules,
- extra Studio features.

## 2) Decide repo mode

Two valid modes:

1. Wrapper mode (fast, current state)
- scripts call core tools from local checkout.
- good for internal staging only.

2. Standalone mode (required for public grant demo)
- copy minimal required runtime scripts and utils from `core/contracts/slot/scripts`,
- replace wrapper calls with native local calls.

For public repo use Standalone mode.

## 3) Standalone migration checklist

1. Create new repo: `reference-slot-demo` (public).
2. Copy current `reference-slot/` tree.
3. Add dependencies in new repo:
- `@coral-xyz/anchor`
- `@solana/web3.js`
- `ts-node`
- `typescript`
4. Replace wrapper script calls in `scripts/common.ts`:
- remove `runCoreYarn(...)` dependency on monorepo,
- call local scripts directly.
5. Copy minimal required local scripts from core:
- `cli_args.ts`
- `v2Sdk.ts`
- `submit_compiled_spec_v2` logic
- `review_compiled_spec_v2` logic
- `init_slot_game_v2` logic
- `devnet_spin_v2` logic
- `replay_v2` logic + `lib/replay_core_v2.ts`
6. Freeze `PROGRAM_ID` and expected cluster in README.
7. Add CI smoke:
- syntax check scripts
- static web health endpoint check
8. Publish and pin tag `v0.1.0-reference`.

## 4) Required reviewer experience

Reviewer must be able to:
1. open `Play` page,
2. perform spin,
3. verify by tx signature in `Verify` page,
4. see `MATCH` from trustless local recompute,
5. inspect frozen hashes on `Spec` page.

Target: under 3 minutes.

## 5) Grant-ready hard requirements

- exactly one frozen slot artifact,
- deterministic replay via RPC only,
- no backend trust requirement,
- no marketplace/casino framing in docs.

## 6) Suggested repo metadata

- repository name: `reference-slot-demo`
- short description:
  `Deterministic on-chain slot reference with trustless replay verification (Solana, CompiledSpec v2).`
- license: MIT
