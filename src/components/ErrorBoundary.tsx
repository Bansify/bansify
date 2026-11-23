import React from 'react';

interface State { error: Error | null }

/** A crashed route must show a message, never a blank screen. */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('Bansify UI error:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen grid place-items-center bg-white dark:bg-zinc-950 p-6">
        <div className="max-w-md text-center">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {this.state.error.message || 'The page failed to render.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-[#0494f4] px-4 py-2 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
