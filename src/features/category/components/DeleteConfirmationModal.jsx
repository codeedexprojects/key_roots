import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?',
  itemDetails = null,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleBackdropClick}>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='w-5 h-5 text-red-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
          </div>
          {!isDeleting && (
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
              disabled={isDeleting}>
              <X className='w-5 h-5' />
            </button>
          )}
        </div>

        {/* Content */}
        <div className='p-6'>
          <p className='text-gray-600 mb-4'>{message}</p>

          {/* Item Details */}
          {itemDetails &&
            Array.isArray(itemDetails) &&
            itemDetails.length > 0 && (
              <div className='bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200'>
                <h4 className='font-medium text-gray-900 mb-2'>
                  Item Details:
                </h4>
                <div className='space-y-1 text-sm text-gray-600'>
                  {itemDetails.map((detail, index) => (
                    <div
                      key={index}
                      className='flex justify-between'>
                      <span className='font-medium'>{detail.label}:</span>
                      <span>{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <div className='flex items-start space-x-2'>
              <AlertTriangle className='w-4 h-4 text-red-500 mt-0.5 flex-shrink-0' />
              <div className='text-sm text-red-700'>
                <p className='font-medium'>Warning:</p>
                <p>
                  This action cannot be undone. The item will be permanently
                  deleted from the system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg'>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2'>
            {isDeleting ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className='w-4 h-4' />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
