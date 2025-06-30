
import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

interface RecentProofsTableProps {
  proofs: Proof[];
}

export const RecentProofsTable = ({ proofs }: RecentProofsTableProps) => {
  const recentProofs = useMemo(() => {
    if (!proofs || proofs.length === 0) return [];
    
    return proofs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [proofs]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getProofStatus = (status: string): 'pass' | 'fail' | 'warning' | 'pending' => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === 'pass' || normalizedStatus === 'valid') return 'pass';
    if (normalizedStatus === 'fail' || normalizedStatus === 'invalid') return 'fail';
    if (normalizedStatus === 'warning') return 'warning';
    return 'pending';
  };

  const extractPropertyId = (proof: Proof) => {
    return proof.metadata?.propertyId || proof.type || proof.id.slice(0, 8);
  };

  const extractStartTs = (proof: Proof) => {
    return proof.metadata?.startTs || proof.timestamp;
  };

  const extractEndTs = (proof: Proof) => {
    return proof.metadata?.endTs || proof.timestamp;
  };

  return (
    <div className="industrial-card">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-mono font-semibold">Recent Proofs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Latest 10 proof verification results
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono text-xs uppercase">Property ID</TableHead>
              <TableHead className="font-mono text-xs uppercase">Start Ts</TableHead>
              <TableHead className="font-mono text-xs uppercase">End Ts</TableHead>
              <TableHead className="font-mono text-xs uppercase">Verdict</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentProofs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No proofs available
                </TableCell>
              </TableRow>
            ) : (
              recentProofs.map((proof) => (
                <TableRow key={proof.id}>
                  <TableCell className="font-mono text-sm">
                    {extractPropertyId(proof)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(extractStartTs(proof))}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(extractEndTs(proof))}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getProofStatus(proof.status)}>
                      {proof.status?.toUpperCase() || 'UNKNOWN'}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
