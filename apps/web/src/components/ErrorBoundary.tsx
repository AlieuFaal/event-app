import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/shadcn/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary to catch and handle React errors gracefully
 * Prevents white screen of death and provides user-friendly error messages
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
            <p className="text-lg text-muted-foreground">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 rounded-lg bg-destructive/10 p-4 text-left">
                <summary className="cursor-pointer font-semibold text-destructive">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-destructive">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={this.handleReset} size="lg">
                Refresh Page
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
