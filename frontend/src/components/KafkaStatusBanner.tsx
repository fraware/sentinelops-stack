
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

export const KafkaStatusBanner = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // For demo purposes, simulate connection status
    const simulateConnection = () => {
      setIsConnected(Math.random() > 0.3); // 70% chance of being connected
    };

    // Initial status
    simulateConnection();

    // Update status every 30 seconds
    const interval = setInterval(simulateConnection, 30000);

    return () => {
      clearInterval(interval);
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Badge 
        variant="outline" 
        className={cn(
          "gap-1 border-0 bg-transparent",
          isConnected ? "text-green-500" : "text-red-500"
        )}
      >
        <Circle 
          className={cn(
            "h-2 w-2",
            isConnected ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"
          )} 
        />
        Kafka {isConnected ? 'Connected' : 'Disconnected'}
      </Badge>
    </div>
  );
};

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
