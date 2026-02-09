# Threat Model

## What a server can fake

- UI rendering and presentation order.
- Cached, delayed, or partially filtered API responses.
- Non-authoritative summary fields (labels, convenience metadata).

## What a server cannot fake

- Finalized on-chain transaction logs available from public RPC.
- On-chain accounts that bind artifact hash and runtime state.
- Deterministic local recompute from immutable inputs.

## How a user detects manipulation

1. Take resolve transaction signature.
2. Fetch transaction/account data from RPC.
3. Recompute outcome/effects locally using the same deterministic rules.
4. Compare recompute with on-chain values:
   - `MATCH`: consistent.
   - `MISMATCH`: indicates tampering, mismatch in inputs, or faulty implementation.

## Assumptions

- RPC trust model: RPC endpoints may be unreliable, so independent endpoints can be cross-checked.
- Finality: verification should target finalized transactions/slots.
- Cryptographic assumptions: hash and signature primitives are not broken.
- Runtime code hash and artifact hash used in verification correspond to the reviewed reference release.
