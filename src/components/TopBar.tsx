import { HelpCircle, Power, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WalletState } from '@/types/demo';
import { MOCK_DATA } from '@/types/demo';

interface TopBarProps {
  wallet: WalletState;
  onHelpClick: () => void;
  onDisconnect: () => void;
}

export function TopBar({ wallet, onHelpClick, onDisconnect }: TopBarProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold tracking-tight">
            BTC-Gas EVM Counter Demo
          </h1>
          <div className="status-pill status-pill-info">
            <span className="pulse-dot bg-info" />
            <span className="font-mono text-[11px]">
              {MOCK_DATA.chainName} (ID: {MOCK_DATA.chainId})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {wallet.status === 'connected' && wallet.address && (
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="font-mono text-sm text-muted-foreground">
                {truncateAddress(wallet.address)}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={onDisconnect}
                  >
                    <Power className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Disconnect wallet</TooltipContent>
              </Tooltip>
            </div>
          )}

          {wallet.status === 'connecting' && (
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Connecting...</span>
            </div>
          )}

          {wallet.status === 'wrong-network' && wallet.address && (
            <div className="flex items-center gap-2 bg-destructive/10 rounded-lg px-3 py-1.5 border border-destructive/30">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="font-mono text-sm text-destructive">
                Wrong Network
              </span>
            </div>
          )}

          <ThemeToggle />

          <Button
            variant="ghost"
            size="sm"
            onClick={onHelpClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4 mr-1.5" />
            How sponsorship works
          </Button>
        </div>
      </div>
    </header>
  );
}
