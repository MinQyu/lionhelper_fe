import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'bordered' | 'elevated' | 'outlined';
}) {
  const baseClasses = 'rounded-lg border-input p-6';

  const cardClasses =
    variant !== 'outlined' ? 'bg-card text-card-foreground' : 'bg-transparent';

  const variantClasses = {
    default: 'border shadow-sm',
    bordered: 'border-3',
    elevated: 'border shadow-lg',
    outlined: 'border-1',
  };

  return (
    <div
      className={cn(
        baseClasses,
        cardClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Card };
