/**
 * Input component.
 * @module shared/components/ui/input
 */
import * as React from 'react';
import { cn } from '@shared/utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input component.
 * @param {InputProps} props - Props.
 * @returns {React.ReactElement} Element.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />;
});
Input.displayName = 'Input';