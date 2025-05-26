import React, { useState } from 'react';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LoadingSpinner, EmptyState } from '@/components/common';
import { getImageUrl } from '@/lib/getImageUrl';

const VendorPackageList = ({
  packages,
  onPackageClick,
  onBack,
  subCategoryTitle,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 9;

  console.log('Packages: ', packages);

  // Calculate pagination
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = packages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil(packages.length / packagesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className='w-full'>
        <div className='flex items-center gap-4 mb-5'>
          <button
            className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
            onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <h2 className='text-xl font-semibold text-gray-800'>
            {subCategoryTitle} - Packages
          </h2>
        </div>
        <div className='flex justify-center items-center min-h-[400px]'>
          <LoadingSpinner size='large' />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4 mb-5'>
        <button
          className='flex items-center gap-2 text-red-700 font-medium focus:outline-none'
          onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <h2 className='text-xl font-semibold text-gray-800'>
          {subCategoryTitle} - Packages
        </h2>
      </div>

      {packages.length === 0 ? (
        <EmptyState
          title='No packages found'
          description='No packages available in this subcategory.'
          icon='default'
        />
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {currentPackages.map((packageItem) => (
              <div
                key={packageItem.id}
                className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer'
                onClick={() => onPackageClick(packageItem)}>
                <div className='h-48 overflow-hidden'>
                  <img
                    src={getImageUrl(packageItem.image) || '/placeholder.svg'}
                    alt={packageItem.title || packageItem.places}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    {packageItem.places || packageItem.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-1'>
                    <span className='font-medium text-gray-700'>Duration:</span>{' '}
                    {packageItem.duration}
                  </p>
                  <div className='flex items-center justify-between mt-3'>
                    <div className='flex items-center gap-2'>
                      {packageItem.ac_available && (
                        <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'>
                          AC
                        </span>
                      )}
                      {packageItem.guide_included && (
                        <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded'>
                          Guide
                        </span>
                      )}
                    </div>
                  </div>
                  {packageItem.sub_category_name && (
                    <p className='text-xs text-gray-500 mt-2'>
                      Category: {packageItem.sub_category_name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 mt-6'>
          <button
            className={`flex items-center gap-1 px-3 py-1 border rounded-md ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}>
            <FaChevronLeft size={12} /> PREV
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === page
                  ? 'bg-red-700 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handlePageChange(page)}>
              {page}
            </button>
          ))}

          <button
            className={`flex items-center gap-1 px-3 py-1 border rounded-md ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}>
            NEXT <FaChevronRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorPackageList;
