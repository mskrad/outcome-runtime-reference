# Architecture

```text
Spec (off-chain)
   ↓
Compiled artifact + hash
   ↓
On-chain registry
   ↓
Resolve (tx)
   ↓
Replay verify by signature
```

## Runtime flow

1. An outcome specification is prepared off-chain and compiled into a deterministic artifact.
2. Artifact hash is registered on-chain.
3. A resolve transaction executes on-chain and emits deterministic outcome/effects.
4. Any verifier can replay verification by transaction signature using RPC data and local recompute.

Randomness preimage reference:
- `randomness = sha256(master_seed || game_id || resolve_id || player_pubkey)` with fixed byte lengths `32/16/8/32` (`resolve_id` is a semantic alias for legacy `spin_id`).

## Scope note

Slot-like adapter is used only as an example. Runtime is outcome-agnostic.

## Trust boundary

- On-chain state/events and RPC-fetched finalized data are the verification base.
- UI/server layers are non-authoritative and may be bypassed entirely during replay verification.
