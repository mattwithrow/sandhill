import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="container">
            <div className="content-card">
              <div className="section-header">
                <h2 className="section-title">Something went wrong</h2>
                <p className="text-gray-600">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn btn-outline"
                >
                  Go Home
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-red-800">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-sm text-red-700 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
