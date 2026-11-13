import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('WebGL/3D Canvas rendering error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-brand-light/50 backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full border border-brand-gold/30 flex items-center justify-center bg-brand-dark text-brand-gold mb-4 shadow-lg">
            <span className="font-serif text-3xl font-bold">N</span>
          </div>
          <p className="font-serif text-base text-brand-dark font-medium">Nikunj Essence Kannauj</p>
          <p className="text-xs text-brand-dark/50 mt-1 max-w-xs">Interactive 3D preview mode active.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
