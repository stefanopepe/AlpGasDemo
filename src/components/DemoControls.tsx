import { useState } from 'react';
import { Settings, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WalletStatus, SponsorshipStatus, TransactionStatus } from '@/types/demo';

interface DemoControlsProps {
  onForceWalletStatus: (status: WalletStatus) => void;
  onForceSponsorshipStatus: (status: SponsorshipStatus) => void;
  onForceTransactionStatus: (status: TransactionStatus) => void;
  onReset: () => void;
}

export function DemoControls({
  onForceWalletStatus,
  onForceSponsorshipStatus,
  onForceTransactionStatus,
  onReset,
}: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-card border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-200 ${
        isOpen ? 'w-72' : 'w-auto'
      }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-2 p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Demo Controls</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {isOpen && (
          <div className="p-4 pt-0 space-y-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Force specific states to explore different scenarios.
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Wallet Status</Label>
                <Select onValueChange={(v) => onForceWalletStatus(v as WalletStatus)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select state..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disconnected">Disconnected</SelectItem>
                    <SelectItem value="connecting">Connecting</SelectItem>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="wrong-network">Wrong Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Sponsorship Status</Label>
                <Select onValueChange={(v) => onForceSponsorshipStatus(v as SponsorshipStatus)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select state..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unchecked">Unchecked</SelectItem>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="eligible">Eligible</SelectItem>
                    <SelectItem value="cooldown">Cooldown Active</SelectItem>
                    <SelectItem value="daily-limit">Daily Limit Reached</SelectItem>
                    <SelectItem value="policy-deny">Policy Denied</SelectItem>
                    <SelectItem value="service-down">Service Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Transaction Status</Label>
                <Select onValueChange={(v) => onForceTransactionStatus(v as TransactionStatus)}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select state..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="awaiting-signature">Awaiting Signature</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onReset}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset Demo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
