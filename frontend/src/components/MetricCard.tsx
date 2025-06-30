
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  subtitle?: string;
  trend?: number;
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  status, 
  subtitle, 
  trend,
  className 
}: MetricCardProps) => {
  return (
    <div className={cn("industrial-card p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <StatusBadge status={status}>
          {status.toUpperCase()}
        </StatusBadge>
      </div>
      
      <div className="space-y-2">
        <div className="metric-value">
          {value}
        </div>
        
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs font-mono",
            trend > 0 ? "text-pass" : trend < 0 ? "text-fail" : "text-muted-foreground"
          )}>
            {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} 
            <span className="ml-1">
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
