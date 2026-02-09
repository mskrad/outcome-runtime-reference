# Expected Transaction Examples (Outcome Runtime)

## Notes

- These are technical examples for replay verification.
- For localnet, signatures become invalid after validator reset.
- For reviewer/demo, generate fresh signatures and append here.

## Example 1 (localnet snapshot)

- `signature`: `3Xmre6JVKdKzzVducgW6ncvhLLhVVUzcxTAwoYiyFEyGr3a8xYevPMPJmLqR33Kr9puahbmtbVMSjEZPzNiXPCSX`
- `game_id_hex`: `744c37f7c2a403712689383286f2ced3`
- expected replay result: `MATCH`

## Example 2 (devnet replay sample)

- `signature`: `5N1QdFv4x5GNYnaZhLi1Tw5tf3FC134THFgSWBjQm7Ea2WXYwyVAUbCkpD2WBGK9MXrC5zMVdy897Zprt4qNWuaf`
- expected replay result: `MATCH`

## How to add a new canonical example

```bash
cd /Users/timurkurmangaliev/web3-slot-marketplace/core/contracts/slot
yarn -s spin:v2 --game-id <GAME_ID_HEX> --bet 1000
yarn -s replay:v2 --sig <TX_SIG> --no-java
```

If replay returns `verification_result : MATCH`, append signature and game_id here.
