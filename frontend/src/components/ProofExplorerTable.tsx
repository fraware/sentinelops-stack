
import { useMemo, useState, useEffect } from 'react';
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

interface ProofExplorerTableProps {
  proofs: Proof[];
  loading: boolean;
  error: any;
  onProofClick: (proof: Proof) => void;
}

export const ProofExplorerTable = ({ proofs, loading, error, onProofClick }: ProofExplorerTableProps) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);

  const sortedProofs = useMemo(() => {
    if (!proofs || proofs.length === 0) return [];
    
    return proofs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [proofs]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (sortedProofs.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedRowIndex(prev => 
            prev < sortedProofs.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedRowIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedRowIndex >= 0 && selectedRowIndex < sortedProofs.length) {
            onProofClick(sortedProofs[selectedRowIndex]);
          }
          break;
        case 'Escape':
          setSelectedRowIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedProofs, selectedRowIndex, onProofClick]);

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

  if (error) {
    return (
      <div className="industrial-card">
        <div className="p-6 text-center">
          <p className="text-red-400">Error loading proofs: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="industrial-card" tabIndex={0}>
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-mono font-semibold">Proof Results</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {loading ? 'Loading...' : `${sortedProofs.length} proofs found`}
        </p>
        {sortedProofs.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Use ↑/↓ to navigate, Enter to select, Esc to clear selection
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-mono text-xs uppercase">Property ID</TableHead>
              <TableHead className="font-mono text-xs uppercase">Start Ts</TableHead>
              <TableHead className="font-mono text-xs uppercase">End Ts</TableHead>
              <TableHead className="font-mono text-xs uppercase">Verdict</TableHead>
              <TableHead className="font-mono text-xs uppercase">Hash</TableHead>
              <TableHead className="font-mono text-xs uppercase">Validator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading proofs...
                </TableCell>
              </TableRow>
            ) : sortedProofs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No proofs found
                </TableCell>
              </TableRow>
            ) : (
              sortedProofs.map((proof, index) => (
                <TableRow 
                  key={proof.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    selectedRowIndex === index && "bg-muted ring-2 ring-primary"
                  )}
                  onClick={() => onProofClick(proof)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Proof ${extractPropertyId(proof)}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onProofClick(proof);
                    }
                  }}
                >
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
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {proof.hash?.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {proof.validator}
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

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
