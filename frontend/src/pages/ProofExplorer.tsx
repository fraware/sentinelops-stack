
import { useState, useMemo } from 'react';
import { useProofs } from '@/hooks/useProofs';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ProofExplorerTable } from '@/components/ProofExplorerTable';
import { ProofDetailsDrawer } from '@/components/ProofDetailsDrawer';
import { EmptyState } from '@/components/EmptyState';

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

const ProofExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Build GraphQL query based on filters
  const query = useMemo(() => {
    const filters: string[] = [];
    
    if (debouncedSearchQuery) {
      filters.push(`propertyId:"${debouncedSearchQuery}"`);
    }
    
    if (startDate) {
      filters.push(`timestamp:>="${startDate.toISOString()}"`);
    }
    
    if (endDate) {
      filters.push(`timestamp:"<=${endDate.toISOString()}"`);
    }
    
    return filters.length > 0 ? filters.join(' AND ') : undefined;
  }, [debouncedSearchQuery, startDate, endDate]);

  const { data, isLoading, error, refetch } = useProofs(query);

  const handleProofClick = (proof: Proof) => {
    setSelectedProof(proof);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProof(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && drawerOpen) {
      handleCloseDrawer();
    }
  };

  const proofs = data?.proofs || [];
  const hasFilters = debouncedSearchQuery || startDate || endDate;

  return (
    <div className="min-h-full bg-background" onKeyDown={handleKeyDown}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-mono font-bold mb-2">Proof Explorer</h1>
          <p className="text-muted-foreground">
            Search and explore proof verification results
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="industrial-card mb-6">
          <div className="p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Property ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    aria-label="Search proofs by Property ID"
                  />
                </div>
              </div>

              {/* Date Range Pickers */}
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      aria-label="Select start date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM dd") : "Start Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      aria-label="Select end date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM dd") : "End Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                    aria-label="Clear date filters"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results or Empty States */}
        {error ? (
          <EmptyState
            type="network-error"
            title="Failed to load proofs"
            description="There was an error connecting to the server. Please check your connection and try again."
            onRetry={refetch}
            retryText="Retry"
          />
        ) : !isLoading && proofs.length === 0 ? (
          <EmptyState
            type="no-results"
            title={hasFilters ? "No proofs match your query" : "No proofs found"}
            description={
              hasFilters 
                ? "Try adjusting your search criteria or date range to find more results."
                : "No proof verification data is available yet."
            }
          />
        ) : (
          <ProofExplorerTable
            proofs={proofs}
            loading={isLoading}
            error={error}
            onProofClick={handleProofClick}
          />
        )}

        {/* Proof Details Drawer */}
        <ProofDetailsDrawer
          proof={selectedProof}
          open={drawerOpen}
          onClose={handleCloseDrawer}
        />
      </div>
    </div>
  );
};

export default ProofExplorer;
