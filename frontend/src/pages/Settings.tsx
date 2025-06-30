
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ManifestData {
  agent: {
    current: string;
    latest: string;
  };
  propertyCatalog: {
    current: string;
    latest: string;
  };
}

const Settings = () => {
  const [manifest, setManifest] = useState<ManifestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManifest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockManifest: ManifestData = {
        agent: {
          current: "v2.1.4",
          latest: "v2.1.5"
        },
        propertyCatalog: {
          current: "v1.3.2",
          latest: "v1.3.2"
        }
      };
      
      setManifest(mockManifest);
    } catch (err) {
      console.error('Manifest fetch error:', err);
      setError('Failed to load agent update information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, []);

  const hasAgentUpdate = manifest && manifest.agent.current !== manifest.agent.latest;
  const hasCatalogUpdate = manifest && manifest.propertyCatalog.current !== manifest.propertyCatalog.latest;

  const handleUpdate = (component: 'agent' | 'catalog') => {
    toast.success(`${component === 'agent' ? 'Agent' : 'Property Catalog'} update initiated`, {
      description: 'The update will be applied in the background'
    });
  };

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-mono font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            System configuration and maintenance
          </p>
        </div>

        <div className="space-y-8">
          {/* Agent Updates Section */}
          <Card className="industrial-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-mono">Agent Updates</CardTitle>
                <CardDescription>
                  Manage agent and property catalog versions
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchManifest} 
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading update information...
                </div>
              ) : manifest ? (
                <div className="space-y-6">
                  {/* Agent Version */}
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-mono font-semibold">Agent</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Current:</span>
                        <code className="text-sm font-mono">{manifest.agent.current}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Latest:</span>
                        <code className="text-sm font-mono">{manifest.agent.latest}</code>
                        {hasAgentUpdate && (
                          <Badge variant="secondary" className="ml-2">
                            Update available
                          </Badge>
                        )}
                      </div>
                    </div>
                    {hasAgentUpdate && (
                      <Button 
                        onClick={() => handleUpdate('agent')}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Update
                      </Button>
                    )}
                  </div>

                  {/* Property Catalog Version */}
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-mono font-semibold">Property Catalog</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Current:</span>
                        <code className="text-sm font-mono">{manifest.propertyCatalog.current}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Latest:</span>
                        <code className="text-sm font-mono">{manifest.propertyCatalog.latest}</code>
                        {hasCatalogUpdate && (
                          <Badge variant="secondary" className="ml-2">
                            Update available
                          </Badge>
                        )}
                      </div>
                    </div>
                    {hasCatalogUpdate && (
                      <Button 
                        onClick={() => handleUpdate('catalog')}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Update
                      </Button>
                    )}
                  </div>

                  {!hasAgentUpdate && !hasCatalogUpdate && (
                    <div className="text-center py-4 text-muted-foreground">
                      All components are up to date
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default Settings;
