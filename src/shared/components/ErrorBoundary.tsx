/**
 * Error boundary component.
 * @module shared/components/ErrorBoundary
 */
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Catches render errors.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    console.error(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="rounded-lg border bg-card p-8 text-center shadow">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}