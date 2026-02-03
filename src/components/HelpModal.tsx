import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            How Sponsorship Works
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            This demo shows how a dapp can sponsor gas fees for users who don't have the native gas token (BTC on this chain).
          </p>

          {/* Flow Diagram */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium mb-3">Sponsorship Flow</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">1</div>
                <div>
                  <span className="font-medium">Connect</span>
                  <p className="text-muted-foreground text-xs">User connects their SCA wallet (account abstraction)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">2</div>
                <div>
                  <span className="font-medium">Check Balance</span>
                  <p className="text-muted-foreground text-xs">Frontend detects 0 BTC balance for gas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">3</div>
                <div>
                  <span className="font-medium">Request Sponsorship</span>
                  <p className="text-muted-foreground text-xs">Backend checks eligibility (cooldown, limits, allowlist)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">4</div>
                <div>
                  <span className="font-medium">Build UserOp</span>
                  <p className="text-muted-foreground text-xs">Backend returns paymaster data for the operation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">5</div>
                <div>
                  <span className="font-medium">Sign & Submit</span>
                  <p className="text-muted-foreground text-xs">User signs, bundler relays, paymaster covers gas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Concepts */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Concepts</h4>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>
                <strong className="text-foreground">Paymaster:</strong> A smart contract that pays gas on behalf of users. The backend controls which operations are sponsored.
              </p>
              <p>
                <strong className="text-foreground">UserOperation:</strong> An ERC-4337 transaction structure that enables account abstraction and sponsored gas.
              </p>
              <p>
                <strong className="text-foreground">Rate Limiting:</strong> Per-wallet cooldowns and daily limits prevent abuse of the sponsorship budget.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
