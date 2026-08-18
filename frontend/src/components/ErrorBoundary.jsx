import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Error Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fdfdfd] text-black flex items-center justify-center p-6">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black" />
            <div className="relative border-[3px] border-black bg-white p-10 text-center">
              <div className="w-16 h-16 border-[3px] border-black bg-black text-white flex items-center justify-center mx-auto mb-6">
                <AlertOctagon size={28} />
              </div>
              <h2 className="text-3xl font-black mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Something Went Wrong
              </h2>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                An unexpected application error occurred while rendering this interface.
              </p>
              {this.state.error?.message && (
                <div className="p-3 border-[2px] border-black bg-red-50 text-red-800 text-xs font-mono text-left mb-6 overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full sm:w-auto px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest border-[2px] border-black hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} /> Reload Application
                </button>
                <a
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest border-[2px] border-black hover:bg-slate-100 flex items-center justify-center gap-2"
                >
                  <Home size={14} /> Go Home
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
