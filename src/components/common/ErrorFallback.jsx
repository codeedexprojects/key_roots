import { AlertCircle } from 'lucide-react';

export function AppErrorFallback({ error }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-center p-6'>
      <AlertCircle className='h-10 w-10 text-red-500 mb-4' />
      <h2 className='text-xl font-semibold mb-2'>Something went wrong</h2>
      <p className='text-gray-600 mb-4'>
        {error?.message || 'Unexpected application error occurred.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className='bg-primary text-white px-4 py-2 rounded-md'>
        Reload Page
      </button>
    </div>
  );
}
