import { useState } from 'react';
import { Code2, Activity, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApiTraceEntry } from '@/types/demo';

interface DeveloperPanelProps {
  apiTrace: ApiTraceEntry[];
}

export function DeveloperPanel({ apiTrace }: DeveloperPanelProps) {
  return (
    <Card className="border-border bg-card h-full">
      <Tabs defaultValue="notes" className="h-full flex flex-col">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes" className="flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5" />
              Developer Notes
            </TabsTrigger>
            <TabsTrigger value="trace" className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              API Trace
              {apiTrace.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 text-[10px] px-1">
                  {apiTrace.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden pt-4">
          <TabsContent value="notes" className="h-full m-0 overflow-y-auto">
            <DeveloperNotes />
          </TabsContent>
          <TabsContent value="trace" className="h-full m-0 overflow-y-auto">
            <ApiTraceList entries={apiTrace} />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

function DeveloperNotes() {
  return (
    <div className="space-y-6 text-sm">
      {/* Overview */}
      <section>
        <h3 className="font-medium mb-2">Overview</h3>
        <p className="text-muted-foreground">
          This demo shows the minimal flow for a zero-balance SCA wallet to interact 
          with an EVM chain where gas is paid in BTC.
        </p>
      </section>

      {/* Flow Bullets */}
      <section>
        <h3 className="font-medium mb-2">Flow Summary</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Frontend detects 0 BTC balance and triggers sponsorship flow</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Backend enforces policy (cooldown, daily limit, allowlist, global cap)</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Backend returns sponsorship payload (paymaster data)</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span>User signs the UserOperation with their wallet</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span>Operation is submitted via bundler/relayer, UI reads updated state</span>
          </li>
        </ul>
      </section>

      {/* Sequence Diagram */}
      <section>
        <h3 className="font-medium mb-2">Sequence</h3>
        <div className="code-block text-xs leading-relaxed">
          <pre className="text-muted-foreground">{`┌─────────┐    ┌─────────┐    ┌─────────┐
│ Frontend│    │ Backend │    │  Chain  │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     │ getBalance() │              │
     │─────────────►│──────────────►
     │              │   0 BTC      │
     │◄─────────────┼──────────────┤
     │              │              │
     │ checkEligibility()          │
     │─────────────►│              │
     │   eligible   │              │
     │◄─────────────┤              │
     │              │              │
     │ buildUserOp()│              │
     │─────────────►│              │
     │ paymasterData│              │
     │◄─────────────┤              │
     │              │              │
     │   [user signs locally]      │
     │              │              │
     │ submitUserOp()              │
     │─────────────►│──────────────►
     │              │   bundler    │
     │   txHash     │◄─────────────┤
     │◄─────────────┤              │
     │              │              │`}</pre>
        </div>
      </section>

      {/* Callout */}
      <section className="bg-primary/10 border border-primary/30 rounded-lg p-3">
        <p className="text-xs">
          <strong className="text-primary">Note:</strong> On this chain, native gas is BTC, 
          but the dapp interaction pattern is still EVM-style. Sponsorship covers BTC gas 
          so users with 0 balance can still transact.
        </p>
      </section>
    </div>
  );
}

function ApiTraceList({ entries }: { entries: ApiTraceEntry[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No API calls yet. Connect your wallet to see the trace.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map(entry => (
        <div key={entry.id} className="api-trace-row">
          <div
            className="api-trace-header"
            onClick={() => toggleExpand(entry.id)}
          >
            <div className="flex items-center gap-2">
              {expanded.has(entry.id) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Badge 
                variant="outline" 
                className={`text-[10px] font-mono ${
                  entry.method === 'GET' ? 'text-info border-info/30' : 'text-success border-success/30'
                }`}
              >
                {entry.method}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px]">
                {entry.endpoint}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={entry.status === 200 ? 'text-success' : 'text-destructive'}>
                {entry.status}
              </span>
              <span className="text-muted-foreground">{entry.duration}ms</span>
            </div>
          </div>
          
          {expanded.has(entry.id) && (
            <div className="api-trace-body">
              {entry.request && (
                <div className="mb-2">
                  <div className="text-muted-foreground mb-1">Request:</div>
                  <pre className="text-foreground whitespace-pre-wrap">
                    {JSON.stringify(entry.request, null, 2)}
                  </pre>
                </div>
              )}
              <div>
                <div className="text-muted-foreground mb-1">Response:</div>
                <pre className="text-foreground whitespace-pre-wrap">
                  {JSON.stringify(entry.response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
