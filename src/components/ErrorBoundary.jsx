import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { STRINGS } from '../lib/constants';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-sg-error/10 flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-sg-error" />
          </div>
          <h2 className="text-h2 text-sg-text mb-2">{STRINGS.STATE_ERROR}</h2>
          <p className="text-body text-sg-text-secondary mb-6 max-w-md">
            {STRINGS.STATE_ERROR_DESCRIPTION}
          </p>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-sg-accent-purple text-white rounded-button text-body font-medium hover:brightness-110 transition-all"
          >
            <RefreshCw size={16} strokeWidth={1.5} />
            {STRINGS.STATE_RETRY}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
