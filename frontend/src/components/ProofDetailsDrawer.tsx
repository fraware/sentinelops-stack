
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';
import { toast } from 'sonner';

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

interface ProofDetailsDrawerProps {
  proof: Proof | null;
  open: boolean;
  onClose: () => void;
}

export const ProofDetailsDrawer = ({ proof, open, onClose }: ProofDetailsDrawerProps) => {
  const handleCopyJson = async () => {
    if (!proof) return;
    
    try {
      const jsonString = JSON.stringify(proof, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast.success('JSON copied to clipboard');
    } catch (error) {
      console.error('Failed to copy JSON:', error);
      toast.error('Failed to copy JSON');
    }
  };

  if (!proof) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-mono">
              Proof Details - {proof.id.slice(0, 12)}...
            </DrawerTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyJson}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy JSON
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-auto">
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase">
                  Status
                </h3>
                <p className="font-mono text-lg font-bold">
                  {proof.status?.toUpperCase() || 'UNKNOWN'}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase">
                  Timestamp
                </h3>
                <p className="text-sm">
                  {new Date(proof.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase">
                  Validator
                </h3>
                <p className="text-sm font-mono">
                  {proof.validator}
                </p>
              </div>
            </div>

            {/* Full JSON */}
            <div className="space-y-2">
              <h3 className="font-mono text-sm font-semibold text-muted-foreground uppercase">
                Full Proof Packet
              </h3>
              <div className="bg-muted rounded-lg p-4 overflow-auto">
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                  {JSON.stringify(proof, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
