# Outcome Spec v0 (Reference Snapshot)

## Purpose

Defines the minimal conceptual shape of outcome-oriented deterministic execution used by this repository.

## Conceptual model

- `outcome_id`: deterministic identifier of the resolved branch.
- `effects`: deterministic list/map of state transitions derived from outcome resolution.
- `input_amount`: caller-provided input value used by deterministic computation.
- `outcome_amount`: computed amount produced by resolved outcome/effects.

## Determinism constraints

- Integer-only arithmetic for consensus-relevant paths.
- Deterministic hashing of immutable inputs.
- No hidden server-side state in replay verification.

## Artifact binding

- Off-chain spec is compiled into frozen artifact(s).
- Artifact hash is committed on-chain and used as replay anchor.
- Verification path relies on RPC transaction/account data plus local recompute.

## Reference artifacts

- `artifacts/compiled_artifact_v2.json`
- `artifacts/compiled_artifact_v2.bin`
- `artifacts/EXPECTED_TX_EXAMPLES.md`

Compatibility aliases retained:
- `artifacts/compiled_spec_v2.json`
- `artifacts/compiled_spec_v2.bin`
