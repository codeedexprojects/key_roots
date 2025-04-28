export const LoadingIndicator = () => {
  return (
    <div className='flex items-center justify-center w-full h-64'>
      <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        <p className='mt-4 text-gray-500'>Loading...</p>
      </div>
    </div>
  );
};
