/**
 * Button component
 * @module shared/components/ui/button
 */
import * as React from 'react';
import { cn } from '@shared/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component.
 * @param {ButtonProps} props - Props.
 * @returns {React.ReactElement} Element.
 */
export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps): React.ReactElement {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50';
  const variants: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-8',
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}