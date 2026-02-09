# Reviewer Runbook (under 3 minutes)

## 1) Start services

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
node web/server.mjs
```

## 2) Open pages

- Play: `http://127.0.0.1:8787/play.html`
- Verify: `http://127.0.0.1:8787/verify.html`
- Spec: `http://127.0.0.1:8787/spec.html`

## 3) Spin flow

1. In Play, click `Init New Game`.
2. Click `Spin`.
3. Copy signature from result panel.

## 4) Verify flow

1. Open Verify page.
2. Paste signature.
3. Click `Verify Locally (trustless)`.
4. Expect `MATCH`.

## 5) Quick CLI equivalent

```bash
cd /Users/timurkurmangaliev/web3-slot-marketplace/reference-slot
yarn submit:compiled
yarn approve:compiled
yarn init:game
yarn spin
yarn replay --sig <TX_SIGNATURE>
```
