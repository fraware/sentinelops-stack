
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'pass' | 'fail' | 'warning' | 'pending';
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  const statusClasses = {
    pass: 'status-pass',
    fail: 'status-fail', 
    warning: 'status-warning',
    pending: 'text-gray-400 border-gray-400/20 bg-gray-400/10'
  };

  return (
    <span className={cn(
      "px-2 py-1 text-xs font-mono font-medium rounded border",
      statusClasses[status],
      className
    )}>
      {children}
    </span>
  );
};
