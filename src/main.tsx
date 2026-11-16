import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0B0D] text-[#F5F2EB] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl border border-white/10 bg-[#141418] p-6 text-center">
            <h1 className="text-lg font-bold text-[#D99B26]">តាមរឿង · Tam MOVIE</h1>
            <p className="mt-2 text-sm text-[#B8B4AB]">
              មានបញ្ហាបច្ចេកទេសបន្តិចបន្តួច។ សូមផ្ទុកទំព័រឡើងវិញ។
            </p>
            <p className="mt-2 text-xs text-[#7E7B73] font-mono break-all">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-[#D99B26] text-[#0B0B0D] text-xs font-semibold cursor-pointer"
            >
              ផ្ទុកឡើងវិញ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
