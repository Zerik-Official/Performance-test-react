/**
 * Card component.
 * @module shared/components/ui/card
 */
import * as React from 'react';
import { cn } from '@shared/utils/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('rounded-xl border bg-card text-card-foreground shadow', className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}