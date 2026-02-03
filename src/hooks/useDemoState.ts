import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DemoState,
  WalletStatus,
  SponsorshipStatus,
  TransactionStatus,
  ApiTraceEntry,
  MOCK_DATA,
} from '@/types/demo';

const initialState: DemoState = {
  wallet: {
    status: 'disconnected',
    address: null,
    balanceSats: 0,
  },
  sponsorship: {
    status: 'unchecked',
    cooldownSeconds: 0,
    dailyRemaining: MOCK_DATA.dailyRemaining,
    dailyLimit: MOCK_DATA.dailyLimit,
  },
  counter: {
    count: MOCK_DATA.initialCount,
    lastEventNewCount: MOCK_DATA.initialCount,
    block: 12345,
    timestamp: new Date().toISOString(),
  },
  transaction: {
    status: 'idle',
  },
  apiTrace: [],
};

export function useDemoState() {
  const [state, setState] = useState<DemoState>(initialState);
  const cooldownInterval = useRef<NodeJS.Timeout | null>(null);

  const addApiTrace = useCallback((entry: Omit<ApiTraceEntry, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      apiTrace: [
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
        ...prev.apiTrace,
      ].slice(0, 20),
    }));
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Cooldown timer effect
  useEffect(() => {
    if (state.sponsorship.status === 'cooldown' && state.sponsorship.cooldownSeconds > 0) {
      cooldownInterval.current = setInterval(() => {
        setState(prev => {
          const newCooldown = prev.sponsorship.cooldownSeconds - 1;
          if (newCooldown <= 0) {
            return {
              ...prev,
              sponsorship: {
                ...prev.sponsorship,
                status: 'eligible',
                cooldownSeconds: 0,
              },
            };
          }
          return {
            ...prev,
            sponsorship: {
              ...prev.sponsorship,
              cooldownSeconds: newCooldown,
            },
          };
        });
      }, 1000);
    }

    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, [state.sponsorship.status, state.sponsorship.cooldownSeconds]);

  const connectWallet = useCallback(async () => {
    setState(prev => ({
      ...prev,
      wallet: { ...prev.wallet, status: 'connecting' },
    }));

    await delay(1500);

    addApiTrace({
      method: 'GET',
      endpoint: `/api/wallet/${MOCK_DATA.mockAddress}/gas-balance`,
      response: { token: 'BTC', balanceSats: 0 },
      status: 200,
      duration: 145,
    });

    setState(prev => ({
      ...prev,
      wallet: {
        status: 'connected',
        address: MOCK_DATA.mockAddress,
        balanceSats: 0,
      },
    }));
  }, [addApiTrace]);

  const disconnectWallet = useCallback(() => {
    setState(prev => ({
      ...prev,
      wallet: { status: 'disconnected', address: null, balanceSats: 0 },
      sponsorship: { ...initialState.sponsorship },
      transaction: { status: 'idle' },
    }));
  }, []);

  const checkSponsorship = useCallback(async () => {
    if (state.wallet.status !== 'connected') return;

    setState(prev => ({
      ...prev,
      sponsorship: { ...prev.sponsorship, status: 'checking' },
    }));

    await delay(800);

    const response = {
      eligible: true,
      reason: null,
      cooldownSeconds: 0,
      dailyRemaining: state.sponsorship.dailyRemaining,
      globalBudgetOk: true,
    };

    addApiTrace({
      method: 'POST',
      endpoint: '/api/sponsor/eligibility',
      request: {
        address: state.wallet.address,
        chainId: MOCK_DATA.chainId,
        contract: MOCK_DATA.counterContract,
        function: 'increment',
      },
      response,
      status: 200,
      duration: 234,
    });

    setState(prev => ({
      ...prev,
      sponsorship: {
        ...prev.sponsorship,
        status: 'eligible',
        cooldownSeconds: 0,
      },
    }));
  }, [state.wallet.status, state.wallet.address, state.sponsorship.dailyRemaining, addApiTrace]);

  const incrementCounter = useCallback(async () => {
    if (state.sponsorship.status !== 'eligible') return;

    // Step 1: Preparing
    setState(prev => ({
      ...prev,
      transaction: { status: 'preparing' },
    }));

    await delay(600);

    const buildResponse = {
      userOp: {
        sender: state.wallet.address,
        nonce: '0x1',
        callData: '0xd09de08a',
        callGasLimit: '0x5208',
      },
      paymasterAndData: '0x5ff1372...abc123',
      sponsorshipId: 'spn_' + crypto.randomUUID().slice(0, 8),
    };

    addApiTrace({
      method: 'POST',
      endpoint: '/api/sponsor/build',
      request: {
        address: state.wallet.address,
        callData: '0xd09de08a',
        nonceHint: 1,
      },
      response: buildResponse,
      status: 200,
      duration: 312,
    });

    // Step 2: Awaiting signature
    setState(prev => ({
      ...prev,
      transaction: { status: 'awaiting-signature' },
    }));
  }, [state.sponsorship.status, state.wallet.address, addApiTrace]);

  const signTransaction = useCallback(async () => {
    setState(prev => ({
      ...prev,
      transaction: { status: 'pending' },
    }));

    const txHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    await delay(400);

    addApiTrace({
      method: 'POST',
      endpoint: '/api/sponsor/submit',
      request: {
        sponsorshipId: 'spn_abc123',
        signedUserOp: { signature: '0x...' },
      },
      response: {
        status: 'submitted',
        txHash,
        explorerUrl: `https://explorer.alpen.dev/tx/${txHash}`,
      },
      status: 200,
      duration: 456,
    });

    setState(prev => ({
      ...prev,
      transaction: {
        status: 'pending',
        txHash,
        explorerUrl: `https://explorer.alpen.dev/tx/${txHash}`,
      },
    }));

    // Simulate confirmation
    await delay(2000);

    const newCount = state.counter.count + 1;

    addApiTrace({
      method: 'GET',
      endpoint: `/api/counter/state?contract=${MOCK_DATA.counterContract}`,
      response: {
        count: newCount,
        lastEventNewCount: newCount,
        block: state.counter.block + 1,
        ts: new Date().toISOString(),
      },
      status: 200,
      duration: 89,
    });

    setState(prev => ({
      ...prev,
      counter: {
        count: newCount,
        lastEventNewCount: newCount,
        block: prev.counter.block + 1,
        timestamp: new Date().toISOString(),
      },
      transaction: {
        ...prev.transaction,
        status: 'success',
      },
      sponsorship: {
        ...prev.sponsorship,
        status: 'cooldown',
        cooldownSeconds: MOCK_DATA.cooldownDuration,
        dailyRemaining: prev.sponsorship.dailyRemaining - 1,
      },
    }));

    // Reset transaction status after showing success
    await delay(2000);
    setState(prev => ({
      ...prev,
      transaction: { status: 'idle' },
    }));
  }, [state.counter.count, state.counter.block, addApiTrace]);

  const rejectTransaction = useCallback(() => {
    setState(prev => ({
      ...prev,
      transaction: { status: 'rejected' },
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        transaction: { status: 'idle' },
      }));
    }, 2000);
  }, []);

  const refreshCounter = useCallback(async () => {
    await delay(300);

    addApiTrace({
      method: 'GET',
      endpoint: `/api/counter/state?contract=${MOCK_DATA.counterContract}`,
      response: {
        count: state.counter.count,
        lastEventNewCount: state.counter.lastEventNewCount,
        block: state.counter.block,
        ts: state.counter.timestamp,
      },
      status: 200,
      duration: 67,
    });
  }, [state.counter, addApiTrace]);

  // Force state functions for demo controls
  const forceWalletStatus = useCallback((status: WalletStatus) => {
    setState(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        status,
        address: status === 'connected' || status === 'wrong-network' 
          ? MOCK_DATA.mockAddress 
          : null,
      },
    }));
  }, []);

  const forceSponsorshipStatus = useCallback((status: SponsorshipStatus) => {
    setState(prev => ({
      ...prev,
      sponsorship: {
        ...prev.sponsorship,
        status,
        cooldownSeconds: status === 'cooldown' ? 45 : 0,
        reason: status === 'policy-deny' 
          ? 'Contract not in allowlist' 
          : status === 'service-down' 
            ? 'Sponsorship service unavailable' 
            : undefined,
      },
    }));
  }, []);

  const forceTransactionStatus = useCallback((status: TransactionStatus) => {
    setState(prev => ({
      ...prev,
      transaction: {
        status,
        txHash: status === 'pending' || status === 'success' 
          ? '0x1234...abcd' 
          : undefined,
      },
    }));
  }, []);

  const resetDemo = useCallback(() => {
    if (cooldownInterval.current) {
      clearInterval(cooldownInterval.current);
    }
    setState({
      ...initialState,
      counter: {
        ...initialState.counter,
        timestamp: new Date().toISOString(),
      },
    });
  }, []);

  return {
    state,
    actions: {
      connectWallet,
      disconnectWallet,
      checkSponsorship,
      incrementCounter,
      signTransaction,
      rejectTransaction,
      refreshCounter,
      forceWalletStatus,
      forceSponsorshipStatus,
      forceTransactionStatus,
      resetDemo,
    },
  };
}
