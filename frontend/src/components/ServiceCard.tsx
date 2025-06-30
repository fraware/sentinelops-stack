
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  uptime: string;
  responseTime: string;
  lastCheck: string;
  endpoint?: string;
  className?: string;
}

export const ServiceCard = ({
  name,
  status,
  uptime,
  responseTime,
  lastCheck,
  endpoint,
  className
}: ServiceCardProps) => {
  return (
    <div className={cn("industrial-card p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-mono font-semibold mb-1">
            {name}
          </h3>
          {endpoint && (
            <p className="text-xs text-muted-foreground font-mono">
              {endpoint}
            </p>
          )}
        </div>
        <StatusBadge status={status}>
          {status.toUpperCase()}
        </StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground uppercase tracking-wide text-xs font-mono mb-1">
            Uptime
          </p>
          <p className="font-mono font-semibold">
            {uptime}
          </p>
        </div>
        
        <div>
          <p className="text-muted-foreground uppercase tracking-wide text-xs font-mono mb-1">
            Response
          </p>
          <p className="font-mono font-semibold">
            {responseTime}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Last check: <span className="font-mono">{lastCheck}</span>
        </p>
      </div>
    </div>
  );
};
