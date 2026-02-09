# Glossary

| Старый термин | Новый термин | Комментарий |
| --- | --- | --- |
| spin | resolve | семантический alias |
| bet | input_amount | входное значение для расчёта outcome |
| win | outcome_amount | amount, полученный из outcome/effects |
| slot spec | outcome spec | runtime-level термин без привязки к домену |

## Compatibility notes

- Legacy instruction names in code (for example `spin_v2`) are preserved for compatibility.
- Documentation uses outcome-first terminology to reduce cognitive noise.
- Aliases are documentation-level only; on-chain behavior and instruction identifiers are unchanged.
