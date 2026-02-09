# Deterministic Outcome Runtime (Reference Demo) for Solana

## What this is

This repository is a **public-good infra intended for reuse**.

It demonstrates an outcome-first deterministic runtime where:
- execution happens on-chain,
- outcomes are represented as `outcome_id + effects`,
- replay verification is performed by transaction signature,
- no backend source of truth is required.

A slot-like adapter is present **only as an example adapter**. The runtime itself is outcome-agnostic.

## What this is NOT

- Not a consumer betting product; this is infrastructure meant for developers.
- Not a marketplace.
- Not a consumer-facing app.
- Not a backend-trust service.

## Core guarantees

- Determinism: identical immutable inputs produce identical outcome/effects.
- Integer-only math: no floating-point divergence in consensus-relevant logic.
- No backend truth: backend responses are optional convenience, never authority.
- Replay verification from RPC only: verification uses public transaction/account data plus local recompute.

## Quick verify (under 3 minutes)

1. Obtain one resolve transaction signature (or use an example signature from artifacts).
2. Run replay verification locally by transaction signature against RPC data.
3. Interpret result: `MATCH` means recompute equals on-chain state; `MISMATCH` means divergence.

Runbook: [`runbooks/RUNBOOK_DEMO.md`](runbooks/RUNBOOK_DEMO.md)
Example signatures: [`artifacts/EXPECTED_TX_EXAMPLES.md`](artifacts/EXPECTED_TX_EXAMPLES.md)

## Documentation

- Architecture: [`docs/architecture.md`](docs/architecture.md)
- ADR (outcome-first): [`docs/adr-0004-outcome-first-runtime.md`](docs/adr-0004-outcome-first-runtime.md)
- Outcome spec snapshot: [`docs/outcome_spec_v0.md`](docs/outcome_spec_v0.md)
- Frozen compiled artifacts: `artifacts/compiled_artifact_v2.json`, `artifacts/compiled_artifact_v2.bin`
- Threat model: [`docs/threat_model.md`](docs/threat_model.md)
- Terminology and aliases: [`docs/GLOSSARY.md`](docs/GLOSSARY.md)
- Local developer commands: [`runbooks/LOCAL_DEV.md`](runbooks/LOCAL_DEV.md)

## Status

- Phase: **3.5**
- Specs: **frozen**
- Implementation: **reference implementation in progress**
