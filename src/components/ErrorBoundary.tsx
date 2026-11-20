import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crash caught by ErrorBoundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-8">
          <AlertTriangle size={32} className="mx-auto text-amber-500 mb-4" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">An unexpected error occurred. Reload the page to continue.</p>
          {this.state.message && (
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono break-all mb-4">{this.state.message}</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}