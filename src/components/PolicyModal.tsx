import { Shield, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MOCK_DATA } from '@/types/demo';

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PolicyModal({ open, onClose }: PolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Sponsorship Policy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            This app sponsors gas fees for specific operations. Below is the current policy configuration.
          </p>

          {/* Allowlists */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              Allowlists
            </h4>
            <div className="bg-muted/30 rounded-lg p-3 space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chain:</span>
                <span>{MOCK_DATA.chainName} (ID: {MOCK_DATA.chainId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract:</span>
                <span className="text-xs">{MOCK_DATA.counterContract}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Function:</span>
                <span className="text-primary">increment()</span>
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Rate Limits
            </h4>
            <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Per-wallet cooldown:</span>
                <span className="font-mono">{MOCK_DATA.cooldownDuration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Per-wallet daily limit:</span>
                <span className="font-mono">{MOCK_DATA.dailyLimit} sponsored tx/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Global budget:</span>
                <span className="font-mono">$100/day equivalent</span>
              </div>
            </div>
          </div>

          {/* Decisioning Note */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Decisioning:</strong> The backend may deny requests 
              at any time based on policy evaluation. Denial responses include a reason field explaining 
              why the request was not approved.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
