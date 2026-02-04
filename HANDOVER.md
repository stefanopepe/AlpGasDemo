# BTC-Gas EVM Counter Demo — Handover Document

> **Purpose**: This document provides context for OpenAI Codex (or any agent) to continue development on the backend, testing, and production readiness of this project.

---

## 1. Project Overview

### What Is This?

A **clickable UX prototype** demonstrating gas sponsorship on an EVM blockchain where the native gas token is BTC. It teaches developers the complete flow of:

1. Connecting a wallet
2. Checking sponsorship eligibility
3. Building a sponsored transaction (UserOp)
4. Signing and submitting via a paymaster
5. Observing on-chain confirmation

### Target Audience

Developers integrating with a gas sponsorship API (paymaster service) on Alpen Testnet or similar BTC-gas EVM chains.

### Current State

- ✅ **Frontend**: Fully functional React/TypeScript UI with all states visualized
- ✅ **Mock State Machine**: Complete simulation of wallet, sponsorship, and transaction flows
- ⚠️ **Backend**: Not implemented — currently uses mock data and simulated delays
- ⚠️ **Tests**: Minimal (only example test exists)
- ⚠️ **Real Integration**: No actual wallet or blockchain connections

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| State | React hooks (`useDemoState`) |
| Routing | react-router-dom v6 |
| Testing | Vitest + React Testing Library |
| Build | Vite |

### Key Files

```
src/
├── pages/Index.tsx          # Main page layout
├── hooks/useDemoState.ts    # Central state machine (393 lines)
├── types/demo.ts            # Type definitions & mock constants
├── components/
│   ├── CounterCard.tsx      # Counter display + increment button
│   ├── GasStatusCard.tsx    # Sponsorship status + eligibility
│   ├── DeveloperPanel.tsx   # API trace viewer
│   ├── TopBar.tsx           # Header with wallet info
│   ├── WalletSignatureModal.tsx  # Signature request modal
│   ├── PolicyModal.tsx      # Sponsorship policy display
│   ├── HelpModal.tsx        # User guide
│   └── DemoControls.tsx     # Dev controls for forcing states
```

---

## 3. State Machine Architecture

### Core State Types

```typescript
// src/types/demo.ts

type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'wrong-network';

type SponsorshipStatus = 
  | 'unchecked' | 'checking' | 'eligible' 
  | 'cooldown' | 'daily-limit' | 'policy-deny' | 'service-down';

type TransactionStatus = 
  | 'idle' | 'preparing' | 'awaiting-signature' 
  | 'pending' | 'success' | 'rejected' | 'failed';
```

### State Flow

```
[Disconnected] → Connect → [Connecting] → [Connected]
                                              ↓
                              Request Sponsorship
                                              ↓
[Unchecked] → [Checking] → [Eligible] ←→ [Cooldown]
                              ↓
                         Increment
                              ↓
[Idle] → [Preparing] → [Awaiting Signature] → [Pending] → [Success]
                              ↓
                          [Rejected]
```

### Mock Data Constants

```typescript
// src/types/demo.ts
export const MOCK_DATA = {
  chainName: 'Alpen Testnet',
  chainId: 8150,
  counterContract: '0x1588967e1635F4aD686cB67EbfDCc1D0A89191Ca',
  mockAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1dE3E',
  initialCount: 12,
  cooldownDuration: 60,  // seconds
  dailyLimit: 5,
  dailyRemaining: 3,
};
```

---

## 4. Backend Requirements

### API Endpoints to Implement

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/wallet/{address}/gas-balance` | Fetch wallet's native BTC gas balance |
| `POST` | `/api/sponsor/eligibility` | Check if address is eligible for sponsorship |
| `POST` | `/api/sponsor/build` | Build UserOp with paymaster data |
| `POST` | `/api/sponsor/submit` | Submit signed UserOp to bundler |
| `GET` | `/api/counter/state` | Read current counter value from chain |

### Eligibility Response Schema

```typescript
{
  eligible: boolean;
  reason: string | null;  // "cooldown", "daily-limit", "policy-deny", etc.
  cooldownSeconds: number;
  dailyRemaining: number;
  globalBudgetOk: boolean;
}
```

### Build Response Schema

```typescript
{
  userOp: {
    sender: string;
    nonce: string;
    callData: string;
    callGasLimit: string;
    // ... other ERC-4337 UserOp fields
  };
  paymasterAndData: string;
  sponsorshipId: string;
}
```

### Submit Response Schema

```typescript
{
  status: 'submitted' | 'failed';
  txHash?: string;
  explorerUrl?: string;
  error?: string;
}
```

---

## 5. Testing Requirements

### Current Test Setup

```
src/test/
├── setup.ts        # Jest-DOM + matchMedia mock
└── example.test.ts # Placeholder test
```

### Tests to Write

#### Unit Tests

1. **State Machine Tests** (`useDemoState.test.ts`)
   - Wallet connection flow
   - Sponsorship eligibility transitions
   - Transaction lifecycle
   - Cooldown timer decrement
   - Reset functionality

2. **Component Tests**
   - `CounterCard.test.tsx` — button states, counter animation
   - `GasStatusCard.test.tsx` — sponsorship status display
   - `WalletSignatureModal.test.tsx` — sign/reject actions

#### Integration Tests

1. **Full Flow Test**
   - Connect → Check Eligibility → Increment → Sign → Success
   - Connect → Check Eligibility → Increment → Reject

2. **Edge Cases**
   - Wrong network handling
   - Service down state
   - Daily limit reached
   - Policy denial

### Running Tests

```bash
# Via Vitest
npx vitest run

# Watch mode
npx vitest
```

---

## 6. Production Readiness Checklist

### High Priority

- [ ] Replace mock delays with real API calls
- [ ] Integrate wallet connection (wagmi/viem or ethers.js)
- [ ] Connect to actual Alpen Testnet RPC
- [ ] Implement real counter contract reads
- [ ] Add error boundaries and fallback UI

### Medium Priority

- [ ] Add comprehensive test coverage (>80%)
- [ ] Implement retry logic for failed API calls
- [ ] Add loading skeletons during data fetches
- [ ] Implement proper WebSocket for tx confirmations
- [ ] Add analytics/telemetry

### Low Priority

- [ ] Optimize bundle size
- [ ] Add PWA support
- [ ] Implement dark/light theme toggle
- [ ] Add i18n support
- [ ] Performance monitoring

---

## 7. Key Implementation Notes

### Cooldown Timer

The cooldown timer is managed in `useDemoState.ts` via `useEffect`:

```typescript
useEffect(() => {
  if (state.sponsorship.status === 'cooldown' && state.sponsorship.cooldownSeconds > 0) {
    cooldownInterval.current = setInterval(() => {
      // Decrement every second, transition to 'eligible' when done
    }, 1000);
  }
  return () => clearInterval(cooldownInterval.current);
}, [state.sponsorship.status, state.sponsorship.cooldownSeconds]);
```

### API Trace

All mock API calls are logged to `state.apiTrace` for the Developer Panel. Real implementation should maintain this for debugging.

### Demo Controls

`DemoControls.tsx` provides dev-only buttons to force any state. Consider:
- Hiding in production via `import.meta.env.PROD`
- Or keeping for support/debugging purposes

---

## 8. File Size Warnings

These files are flagged as large and should be refactored:

| File | Lines | Recommendation |
|------|-------|----------------|
| `useDemoState.ts` | 393 | Split into smaller hooks: `useWallet`, `useSponsorship`, `useTransaction` |
| `CounterCard.tsx` | 248 | Extract `TransactionStatus` display into separate component |

---

## 9. Environment Variables

Currently none required (all mock data). For production:

```env
VITE_ALPEN_RPC_URL=https://rpc.alpen.dev
VITE_COUNTER_CONTRACT=0x1588967e1635F4aD686cB67EbfDCc1D0A89191Ca
VITE_SPONSOR_API_URL=https://sponsor.alpen.dev/api
VITE_CHAIN_ID=8150
```

---

## 10. Quick Start for Codex

### Read First

1. `src/types/demo.ts` — All type definitions
2. `src/hooks/useDemoState.ts` — State machine logic
3. `src/pages/Index.tsx` — Main page composition

### First Tasks

1. **Add unit tests** for `useDemoState` hook
2. **Create API client** module at `src/lib/api.ts`
3. **Add wallet integration** with wagmi/viem

### Commands

```bash
# Install dependencies
bun install

# Dev server
bun run dev

# Run tests
bun run test

# Build
bun run build
```

---

## 11. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Index.tsx                            │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │  TopBar     │  │ Modals      │  │ DemoControls         │ │
│  └─────────────┘  └─────────────┘  └──────────────────────┘ │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │   Left Column        │  │   Right Column               │ │
│  │  ┌────────────────┐  │  │  ┌────────────────────────┐  │ │
│  │  │ CounterCard    │  │  │  │ DeveloperPanel         │  │ │
│  │  │ - Counter      │  │  │  │ - API Trace            │  │ │
│  │  │ - Tx Status    │  │  │  │ - Request/Response     │  │ │
│  │  │ - Actions      │  │  │  └────────────────────────┘  │ │
│  │  └────────────────┘  │  │                              │ │
│  │  ┌────────────────┐  │  │                              │ │
│  │  │ GasStatusCard  │  │  │                              │ │
│  │  │ - Eligibility  │  │  │                              │ │
│  │  │ - Cooldown     │  │  │                              │ │
│  │  └────────────────┘  │  │                              │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  useDemoState()  │
                    │  - wallet        │
                    │  - sponsorship   │
                    │  - counter       │
                    │  - transaction   │
                    │  - apiTrace      │
                    └──────────────────┘
                              │
                              ▼ (TODO: Replace mocks)
                    ┌──────────────────┐
                    │   Backend API    │
                    │  /api/sponsor/*  │
                    │  /api/counter/*  │
                    └──────────────────┘
```

---

## 12. Contact & Resources

- **Live Preview**: https://id-preview--d825e530-ceab-4c81-af80-164ffd3d244c.lovable.app
- **Published URL**: https://alp-gas-abstraction.lovable.app
- **Chain Explorer**: https://explorer.testnet.alpenlabs.io
- **Faucet**: https://faucet.testnet.alpenlabs.io

---

*Last updated: 2026-02-04*
