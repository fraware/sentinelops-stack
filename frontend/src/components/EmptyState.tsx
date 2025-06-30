
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'network-error';
  title: string;
  description: string;
  onRetry?: () => void;
  retryText?: string;
}

export const EmptyState = ({ type, title, description, onRetry, retryText = 'Try again' }: EmptyStateProps) => {
  const Icon = type === 'no-results' ? Search : AlertTriangle;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mb-4",
        type === 'no-results' ? "bg-muted" : "bg-destructive/10"
      )}>
        <Icon className={cn(
          "h-8 w-8",
          type === 'no-results' ? "text-muted-foreground" : "text-destructive"
        )} />
      </div>
      
      <h3 className="text-lg font-mono font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  );
};

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
