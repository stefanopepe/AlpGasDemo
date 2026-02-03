export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'wrong-network';

export type SponsorshipStatus = 
  | 'unchecked'
  | 'checking'
  | 'eligible'
  | 'cooldown'
  | 'daily-limit'
  | 'policy-deny'
  | 'service-down';

export type TransactionStatus = 
  | 'idle'
  | 'preparing'
  | 'awaiting-signature'
  | 'pending'
  | 'success'
  | 'rejected'
  | 'failed';

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  balanceSats: number;
}

export interface SponsorshipState {
  status: SponsorshipStatus;
  cooldownSeconds: number;
  dailyRemaining: number;
  dailyLimit: number;
  reason?: string;
}

export interface CounterState {
  count: number;
  lastEventNewCount: number;
  block: number;
  timestamp: string;
}

export interface TransactionState {
  status: TransactionStatus;
  txHash?: string;
  explorerUrl?: string;
}

export interface ApiTraceEntry {
  id: string;
  timestamp: Date;
  method: 'GET' | 'POST';
  endpoint: string;
  request?: object;
  response: object;
  status: number;
  duration: number;
}

export interface DemoState {
  wallet: WalletState;
  sponsorship: SponsorshipState;
  counter: CounterState;
  transaction: TransactionState;
  apiTrace: ApiTraceEntry[];
}

export const MOCK_DATA = {
  chainName: 'Alpen Testnet',
  chainId: 8150,
  counterContract: '0x1588967e1635F4aD686cB67EbfDCc1D0A89191Ca',
  mockAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1dE3E',
  initialCount: 12,
  cooldownDuration: 60,
  dailyLimit: 5,
  dailyRemaining: 3,
} as const;
