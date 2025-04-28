export const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass =
    size === 'small'
      ? 'h-4 w-4 border-2'
      : size === 'large'
      ? 'h-16 w-16 border-4'
      : 'h-8 w-8 border-3';

  return (
    <div
      className={`animate-spin rounded-full ${sizeClass} border-t-transparent border-b-transparent border-primary`}></div>
  );
};
