import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = '오류가 발생했습니다',
  message,
  className,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 text-destructive">{title}</h3>
        {message && <p className="text-muted-foreground mb-4">{message}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
