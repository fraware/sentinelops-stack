
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  service?: string;
}

interface AlertPanelProps {
  alerts: Alert[];
  className?: string;
}

export const AlertPanel = ({ alerts, className }: AlertPanelProps) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-fail" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-pass" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAlertBg = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return 'bg-fail/5 border-fail/20';
      case 'warning':
        return 'bg-yellow-400/5 border-yellow-400/20';
      case 'success':
        return 'bg-pass/5 border-pass/20';
      default:
        return 'bg-muted/5 border-muted/20';
    }
  };

  return (
    <div className={cn("industrial-card", className)}>
      <div className="p-6 pb-4">
        <h2 className="text-lg font-mono font-semibold">System Alerts</h2>
      </div>
      
      <div className="px-6 pb-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-pass" />
            <p className="font-mono text-sm">All systems operational</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border",
                  getAlertBg(alert.type)
                )}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      {alert.service && (
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                          {alert.service}
                        </span>
                      )}
                      <span className="text-xs font-mono text-muted-foreground">
                        {alert.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
