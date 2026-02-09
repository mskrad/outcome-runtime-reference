# RUNBOOK_DEMO

Goal: complete trustless replay verification in under 3 minutes.

## Prerequisites

- Access to a Solana RPC endpoint for the target cluster.
- A resolve transaction signature (fresh or from `artifacts/EXPECTED_TX_EXAMPLES.md`).
- Local environment capable of running repository replay verification script.

## Step 1: Get a resolve transaction signature

- Option A: execute one resolve flow in your existing setup and copy the resulting signature.
- Option B: use a reference signature from `artifacts/EXPECTED_TX_EXAMPLES.md`.

## Step 2: Run replay verification by signature

- Provide the signature to the local replay verification flow.
- Verification must use only:
  - RPC transaction/account data,
  - local deterministic recompute.

Example CLI:

```bash
export ANCHOR_PROVIDER_URL=https://api.mainnet-beta.solana.com
yarn replay --sig <SIG>
```

Optional UI path:
- Open `http://127.0.0.1:8787/verify.html`, paste signature, run local verify.

Trustless property: no backend response is required as source of truth.

## Step 3: Interpret result

- `MATCH`:
  - local recompute equals on-chain outcome/effects,
  - deterministic pipeline is consistent for this transaction.
- `MISMATCH`:
  - recompute differs from on-chain values,
  - indicates divergence in inputs, artifact binding, or implementation.

## Verification principle

Replay verification is trustless because it depends on immutable chain data (via RPC) plus local recompute, not on any private server state.
