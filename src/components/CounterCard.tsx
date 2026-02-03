import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Wallet, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CounterState, WalletState, SponsorshipState, TransactionState } from '@/types/demo';
import { MOCK_DATA } from '@/types/demo';
import { toast } from 'sonner';

interface CounterCardProps {
  counter: CounterState;
  wallet: WalletState;
  sponsorship: SponsorshipState;
  transaction: TransactionState;
  onConnect: () => void;
  onIncrement: () => void;
  onRefresh: () => void;
}

export function CounterCard({
  counter,
  wallet,
  sponsorship,
  transaction,
  onConnect,
  onIncrement,
  onRefresh,
}: CounterCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prevCount, setPrevCount] = useState(counter.count);

  useEffect(() => {
    if (counter.count !== prevCount) {
      setIsAnimating(true);
      setPrevCount(counter.count);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [counter.count, prevCount]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    toast.success('Read from RPC: getCount() OK', {
      duration: 2000,
    });
    setIsRefreshing(false);
  };

  const isConnected = wallet.status === 'connected';
  const canIncrement = 
    isConnected && 
    sponsorship.status === 'eligible' && 
    transaction.status === 'idle';

  const getIncrementButtonContent = () => {
    if (transaction.status === 'preparing') {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Preparing...
        </>
      );
    }
    if (transaction.status === 'awaiting-signature') {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Awaiting Signature...
        </>
      );
    }
    if (transaction.status === 'pending') {
      return (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Confirming...
        </>
      );
    }
    if (transaction.status === 'success') {
      return (
        <>
          <Check className="h-4 w-4 mr-2" />
          Success!
        </>
      );
    }
    if (transaction.status === 'rejected') {
      return (
        <>
          <X className="h-4 w-4 mr-2" />
          Rejected
        </>
      );
    }
    if (transaction.status === 'failed') {
      return (
        <>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Failed
        </>
      );
    }
    
    if (sponsorship.status === 'eligible') {
      return (
        <>
          <Plus className="h-4 w-4 mr-2" />
          +1 (Sponsored)
        </>
      );
    }
    
    return (
      <>
        <Plus className="h-4 w-4 mr-2" />
        +1
      </>
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Counter Contract
          <span className="font-mono text-xs text-muted-foreground font-normal">
            {MOCK_DATA.counterContract.slice(0, 10)}...
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Counter Display */}
        <div className="text-center py-8">
          <div className="mb-2 text-sm text-muted-foreground uppercase tracking-wide">
            Current Value
          </div>
          <div className={`counter-display ${isAnimating ? 'count-increment' : ''}`}>
            {counter.count}
          </div>
        </div>

        {/* Event Info */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last emitted event:</span>
            <span className="text-foreground">
              CountIncremented({counter.lastEventNewCount})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Block:</span>
            <span className="text-foreground">#{counter.block}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Updated:</span>
            <span className="text-foreground">{formatTime(counter.timestamp)}</span>
          </div>
        </div>

        {/* Transaction Status */}
        {transaction.status === 'pending' && transaction.txHash && (
          <div className="bg-info/10 border border-info/30 rounded-lg p-3 slide-up">
            <div className="flex items-center gap-2 text-sm text-info mb-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitted (waiting for inclusion)...
            </div>
            <div className="font-mono text-xs text-muted-foreground truncate">
              TX: {transaction.txHash}
            </div>
          </div>
        )}

        {transaction.status === 'success' && transaction.txHash && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-3 slide-up">
            <div className="flex items-center gap-2 text-sm text-success mb-1">
              <Check className="h-4 w-4" />
              Transaction confirmed!
            </div>
            <div className="font-mono text-xs text-muted-foreground truncate">
              TX: {transaction.txHash}
            </div>
          </div>
        )}

        {transaction.status === 'rejected' && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 slide-up">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <X className="h-4 w-4" />
              Signature rejected by user
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isConnected ? (
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={onConnect}
              disabled={wallet.status === 'connecting'}
            >
              {wallet.status === 'connecting' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                className={`flex-1 ${
                  transaction.status === 'success'
                    ? 'bg-success hover:bg-success/90'
                    : transaction.status === 'rejected' || transaction.status === 'failed'
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90'
                } text-primary-foreground`}
                onClick={onIncrement}
                disabled={!canIncrement}
              >
                {getIncrementButtonContent()}
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
