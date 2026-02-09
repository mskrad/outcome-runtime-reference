# LOCAL_DEV

Local development and demo commands are intentionally isolated here (not in README).

## Typical command flow

```bash
yarn submit:compiled
yarn approve:compiled
yarn init:game
yarn resolve
yarn replay --sig <TX_SIGNATURE>
```

## Notes

- `resolve` command points to `scripts/resolve_v2.ts` (alias entrypoint).
- `scripts/resolve_v2.ts` reuses legacy `spin_v2.ts` behavior for compatibility.
- Script naming compatibility is documented in `docs/GLOSSARY.md`.
- Runtime behavior is unchanged; aliases are documentation-level only.
