
import { useMemo } from 'react';
import { StatusBadge } from './StatusBadge';

interface Proof {
  id: string;
  timestamp: string;
  status: string;
  type: string;
  metadata: any;
  hash: string;
  size: number;
  validator: string;
}

interface SystemHealthCardProps {
  proofs: Proof[];
}

export const SystemHealthCard = ({ proofs }: SystemHealthCardProps) => {
  const systemHealth = useMemo(() => {
    if (!proofs || proofs.length === 0) {
      return { status: 'pending' as const, percentage: 0, totalProofs: 0 };
    }

    // Filter proofs from last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentProofs = proofs.filter(proof => 
      new Date(proof.timestamp) > oneHourAgo
    );

    if (recentProofs.length === 0) {
      return { status: 'pending' as const, percentage: 0, totalProofs: 0 };
    }

    const passCount = recentProofs.filter(proof => 
      proof.status?.toLowerCase() === 'pass' || 
      proof.status?.toLowerCase() === 'valid'
    ).length;

    const percentage = Math.round((passCount / recentProofs.length) * 100);
    const status = percentage >= 80 ? 'pass' : percentage >= 50 ? 'warning' : 'fail';

    return { 
      status: status as 'pass' | 'warning' | 'fail', 
      percentage, 
      totalProofs: recentProofs.length 
    };
  }, [proofs]);

  return (
    <div className="industrial-card p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono font-semibold">System Health</h2>
        <StatusBadge status={systemHealth.status}>
          {systemHealth.status.toUpperCase()}
        </StatusBadge>
      </div>

      <div className="space-y-4">
        <div className="metric-value text-4xl">
          {systemHealth.percentage}%
        </div>
        
        <p className="text-muted-foreground">
          Based on {systemHealth.totalProofs} proofs in the last hour
        </p>

        <div className="w-full bg-border rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              systemHealth.status === 'pass' ? 'bg-pass' :
              systemHealth.status === 'warning' ? 'bg-yellow-400' : 'bg-fail'
            }`}
            style={{ width: `${systemHealth.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
