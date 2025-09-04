import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = '데이터가 없습니다',
  message,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="text-center">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
