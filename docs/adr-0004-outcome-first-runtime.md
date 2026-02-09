# ADR-0004: Outcome-First Runtime Framing

## Status

Accepted (Phase 3.5)

## Context

Current reference implementation includes legacy naming from an example adapter domain. This creates packaging risk for infrastructure review because domain terms can be mistaken for product scope.

## Decision

Adopt outcome-first framing in repository documentation:
- primary entities are `outcome_id` and `effects`;
- runtime is described as outcome-agnostic deterministic infrastructure;
- replay verification by transaction signature is emphasized as trustless baseline.

Legacy code identifiers remain unchanged for compatibility.

## Consequences

- No behavioral or consensus changes.
- Lower ambiguity for external reviewers.
- Cleaner separation between reusable runtime primitives and adapter-specific vocabulary.
