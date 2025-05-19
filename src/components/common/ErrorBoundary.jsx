import React from 'react';
import { AlertCircle } from 'lucide-react';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex flex-col items-center justify-center p-6 text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
          <h2 className='text-xl font-semibold mb-2'>Something went wrong.</h2>
          <p className='text-gray-600 mb-4'>
            An unexpected error occurred. Please try refreshing the page or come
            back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
