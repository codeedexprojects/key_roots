import { Package, PlusCircle, AlertCircle, Bus } from 'lucide-react';

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'default',
}) => {
  // Choose icon based on the icon prop
  const renderIcon = () => {
    switch (icon) {
      case 'package':
        return <Package className='h-12 w-12 text-gray-400' />;
      case 'bus':
        return <Bus className='h-12 w-12 text-gray-400' />;
      case 'error':
        return <AlertCircle className='h-12 w-12 text-red-400' />;
      default:
        return <PlusCircle className='h-12 w-12 text-gray-400' />;
    }
  };

  return (
    <div className='border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50'>
      <div className='mb-4'>{renderIcon()}</div>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>{title}</h3>
      <p className='text-sm text-gray-500 mb-6 text-center max-w-md'>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className='px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
