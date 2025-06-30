
import { useEffect } from 'react';
import { useProofs } from '@/hooks/useProofs';
import { SystemHealthCard } from '@/components/SystemHealthCard';
import { RecentProofsTable } from '@/components/RecentProofsTable';
import { ProofTrendChart } from '@/components/ProofTrendChart';
import { AuditBundlePanel } from '@/components/AuditBundlePanel';
import { KafkaStatusBanner } from '@/components/KafkaStatusBanner';

const Dashboard = () => {
  const { data, isLoading, error, refetch } = useProofs();

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">Error loading dashboard data</div>
        </div>
      </div>
    );
  }

  const proofs = data?.proofs || [];

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-mono font-bold">Dashboard</h1>
            <KafkaStatusBanner />
          </div>
          <p className="text-muted-foreground">
            Real-time system health and proof verification status
          </p>
        </div>

        <div className="space-y-8">
          {/* System Health Card */}
          <SystemHealthCard proofs={proofs} />

          {/* Audit Bundle Panel */}
          <AuditBundlePanel />

          {/* Chart Section - Full Width */}
          <div className="w-full">
            <ProofTrendChart proofs={proofs} />
          </div>

          {/* Recent Proofs Table - Full Width */}
          <div className="w-full">
            <RecentProofsTable proofs={proofs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
