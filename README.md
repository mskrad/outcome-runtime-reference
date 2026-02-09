# Outcome Runtime Reference (Frozen Phase 3 Artifact)

## 1) What this is

`reference-slot` is a reference implementation of a deterministic on-chain outcome resolution flow using `CompiledSpec v2`.

It demonstrates:
- deterministic on-chain execution,
- replay verification by transaction signature,
- trustless outcome verification from RPC data.

The demo package contains one frozen reference artifact.

## 2) What this is NOT

- Not a marketplace.
- Not a consumer product.
- Not a backend-trust service.
- Not a replacement for Slot Studio (Studio remains the factory workflow).

## 3) Frozen reference artifact

- source spec: `docs/gamespec/demo_5x3_v1.json`
- frozen compiled descriptor: `reference-slot/artifacts/compiled_spec_v2.json`
- frozen compiled blob: `reference-slot/artifacts/compiled_spec_v2.bin`
- `compiled_spec_hash`: `fe077796a7e7b5987907b6760f1f10a70eee3ec3a93faa3784b898450e341306`
- `scale_k_2048`: `2158/2048`

## 4) Local run (localnet)

```bash
cd $HOME/web3-slot-marketplace
core/contracts/slot/scripts/localnet_up.sh
```

```bash
cd $HOME/web3-slot-marketplace/core/contracts/slot
ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
anchor deploy --provider.cluster localnet
```

```bash
cd $HOME/web3-slot-marketplace/reference-slot
cp .env.example .env
node web/server.mjs
```

Open:
- `http://127.0.0.1:8787/play.html`
- `http://127.0.0.1:8787/verify.html`
- `http://127.0.0.1:8787/spec.html`

Quick reviewer flow:
- `reference-slot/RUNBOOK.md`

## 5) CLI flow

```bash
cd $HOME/web3-slot-marketplace/reference-slot
yarn submit:compiled
yarn approve:compiled
yarn init:game
yarn resolve
yarn replay --sig <TX_SIGNATURE>
```

Notes:
- scripts are thin wrappers over existing Phase 3 core scripts (`core/contracts/slot/scripts/*`),
- wallet and RPC are read from `ANCHOR_WALLET` and `ANCHOR_PROVIDER_URL`,
- web API signer is server-side only (`ANCHOR_WALLET` from environment),
- in monorepo mode wrappers use `../core/contracts/slot/node_modules/.bin/ts-node`,
- standalone extraction steps are described in `reference-slot/OPEN_REPO_MIGRATION.md`.

## 6) Fairness verification (step-by-step)

1. Execute a resolve transaction and copy its signature.
2. Open Verify page and run local trustless verification.
3. The page fetches transaction logs from RPC, decodes `SpinCompletedV2`, recomputes randomness, and validates outcome semantics.
4. Result:
- `MATCH` if recomputed values equal on-chain values,
- `MISMATCH` otherwise.

Core formula:
- `randomness = sha256(master_seed || game_id || spin_id_le || player_pubkey)`

## 7) Example signatures

See:
- `reference-slot/artifacts/EXPECTED_TX_EXAMPLES.md`

## 8) Consensus and trust boundaries

Consensus source of truth:
- compiled binary blob and its `compiled_spec_hash`.

Important:
- canonical JSON is only an intermediate compiler representation,
- canonical JSON is not a consensus format.

What a server can fake:
- UI rendering,
- cached responses,
- convenience API responses.

What a server cannot fake:
- on-chain logs/accounts from public RPC,
- deterministic recomputation from immutable inputs,
- `compiled_spec_hash` bound in on-chain state and events.

How to detect server lies:
- run local trustless verify in browser (RPC direct),
- compare with optional server replay,
- use transaction signature as immutable reference.

## 9) Architecture (ASCII)

```text
Outcome/Reward Spec (off-chain)
        |
        v
CompiledSpec v2 (frozen blob + hash)
        |
        v
Approved registry (on-chain)
        |
        v
initialize_game_v2 -> spin_v2(tx)
        |
        v
replay_verify(signature) from RPC only
        |
        v
MATCH / MISMATCH
```
