# Reference Slot (Frozen Phase 3 Artifact)

## 1) What this is

`reference-slot` is a reference implementation of an on-chain deterministic slot using `CompiledSpec v2`.

It demonstrates:
- deterministic on-chain execution,
- provable fairness via deterministic replay,
- verification by transaction signature from RPC data.

It contains exactly one frozen slot artifact.

## 2) What this is NOT

- Not a casino product.
- Not a marketplace.
- Not a consumer SaaS.
- Not a replacement for Slot Studio (Studio remains the factory).

## 3) Frozen slot

- source spec: `docs/gamespec/demo_5x3_v1.json`
- frozen compiled: `reference-slot/artifacts/compiled_spec_v2.json`
- frozen compiled blob: `reference-slot/artifacts/compiled_spec_v2.bin`
- `compiled_spec_hash`: `fe077796a7e7b5987907b6760f1f10a70eee3ec3a93faa3784b898450e341306`
- paytable scale: `2158/2048`

## 4) Local run (localnet)

```bash
cd /Users/timurkurmangaliev/web3-slot-marketplace
core/contracts/slot/scripts/localnet_up.sh
```

```bash
cd /Users/timurkurmangaliev/web3-slot-marketplace/core/contracts/slot
ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 \
ANCHOR_WALLET=$HOME/.config/solana/id.json \
anchor deploy --provider.cluster localnet
```

```bash
cd /Users/timurkurmangaliev/web3-slot-marketplace/reference-slot
cp .env.example .env
node web/server.mjs
```

Open:
- `http://127.0.0.1:8787/play.html`
- `http://127.0.0.1:8787/verify.html`
- `http://127.0.0.1:8787/spec.html`

## 5) Script flow (CLI)

```bash
cd /Users/timurkurmangaliev/web3-slot-marketplace/reference-slot
yarn submit:compiled
yarn approve:compiled
yarn init:game
yarn spin
yarn replay --sig <TX_SIGNATURE>
```

Notes:
- scripts are thin wrappers over existing Phase 3 core scripts (`core/contracts/slot/scripts/*`),
- wallet and RPC are taken from `ANCHOR_WALLET` and `ANCHOR_PROVIDER_URL`.
- in monorepo mode wrappers use `../core/contracts/slot/node_modules/.bin/ts-node`.
- for standalone public repo migration see:
  - `reference-slot/OPEN_REPO_MIGRATION.md`

## 6) Fairness verification (step-by-step)

1. Execute a spin and copy the transaction signature.
2. Open Verify page and run local trustless verification.
3. The page fetches transaction logs from RPC, decodes `SpinCompletedV2`, recomputes randomness, and checks outcome semantics.
4. Result:
- `MATCH` if recomputed values equal on-chain event values,
- `MISMATCH` otherwise.

Core formula:
- `randomness = sha256(master_seed || game_id || spin_id_le || player_pubkey)`

## 7) Example signatures

See:
- `reference-slot/artifacts/EXPECTED_TX_EXAMPLES.md`

## 8) Threat model

What a server can fake:
- UI rendering,
- cached responses,
- convenience API responses.

What a server cannot fake:
- on-chain transaction logs and account data from public RPC,
- deterministic recomputation from immutable inputs,
- `compiled_spec_hash` bound in on-chain flow.

How to detect server lies:
- use local trustless verify in browser (RPC direct),
- compare with server replay result (optional),
- rely on transaction signature as immutable reference.

## 9) Architecture (ASCII)

```
Reward/Game Spec (off-chain)
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
