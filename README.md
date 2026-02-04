# BTC-Gas Sponsorship Demo

This repo is a clickable prototype that shows how gas sponsorship would feel on an EVM chain where the gas token is BTC. It walks through connecting a wallet, checking if a user qualifies for sponsored gas, building the sponsored transaction, and watching it confirm. Everything runs with mock data today, so you can explore the full journey without needing a real wallet or chain access.

- **Who it's for**: Developers curious about building on Alpen Testnet or similar BTC-gas EVM networks.
- **What you’ll see**: Wallet connection states, eligibility checks (cooldowns, limits, policy denials), transaction signing prompts, and a simple counter contract that increments when a sponsored call succeeds.
- **Upstream Lovable project**: https://lovable.dev/projects/d825e530-ceab-4c81-af80-164ffd3d244c (changes stay in sync).

## Try it quickly

- Live preview: https://id-preview--d825e530-ceab-4c81-af80-164ffd3d244c.lovable.app
- Published demo: https://alp-gas-abstraction.lovable.app

## Run it locally

You only need Node.js. Bun is recommended but npm works too.

```sh
# install deps
bun install   # or: npm install

# start dev server (opens at localhost:5173)
bun run dev   # or: npm run dev

# run tests
bun run test  # or: npm run test
```

## How the UI is organized

- `src/pages/Index.tsx`: Page layout wiring everything together.
- `src/hooks/useDemoState.ts`: The mock state machine that drives wallet, sponsorship, and transaction states.
- `src/components/*`: Cards, modals, and the developer panel that show each step of the flow.

## What’s real vs mock

- The UI, loading states, and error paths are fully represented.
- API calls, wallet connections, and chain reads are simulated. Swap the mocks with real endpoints and a wallet provider when you’re ready to integrate.

## Next steps for builders

- Replace mock API calls with your sponsor service.
- Hook up a wallet (wagmi/viem or ethers) and point to Alpen Testnet RPC.
- Keep the Developer Panel for quick trace debugging during integration.
