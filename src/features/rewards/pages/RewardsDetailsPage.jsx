import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export const RewardDetailsPage = () => {
  const { rewardId } = useParams();

  // Sample reward data (in a real app, you'd fetch this based on the ID)
  const rewardData = {
    id: rewardId,
    bookingOption: {
      name: 'Ziyad',
      id: '23458687',
      date: '01/02/2025',
      referID: '#30125845',
      reward: '$300',
      status: 'Withdraw',
      upiID: '58466244@axl',
    },
    referOption: {
      name: 'Ziyad',
      id: '23458997',
      date: '02/09/2024',
      referID: '#30125845',
      reward: '$200',
      status: 'Withdraw',
      upiID: '58466244@axl',
    },
  };

  return (
    <div className='flex-1 overflow-auto'>
      {/* Back Button */}
      <div className='mb-6'>
        <Link
          to='/rewards'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Booking Option Card */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='p-6'>
            <div className='space-y-4 border-b pb-4'>
              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Your Name :</p>
                <p className='font-medium'>{rewardData.bookingOption.name}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Option (Booking Id) :</p>
                <p className='font-medium'>{rewardData.bookingOption.id}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Date :</p>
                <p className='font-medium'>{rewardData.bookingOption.date}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Refer Id :</p>
                <p className='font-medium text-red-500'>
                  {rewardData.bookingOption.referID}
                </p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Reward :</p>
                <p className='font-medium'>{rewardData.bookingOption.reward}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Status :</p>
                <p className='font-medium text-orange-500'>
                  {rewardData.bookingOption.status}
                </p>
              </div>
            </div>

            <div className='pt-4'>
              <p className='text-sm font-medium mb-2'>Withdraw mode</p>
              <div className='flex justify-between items-center mb-4'>
                <p className='text-sm text-gray-500'>UPI Id :</p>
                <p className='font-medium'>{rewardData.bookingOption.upiID}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Total :</p>
                <p className='font-medium text-red-500'>
                  {rewardData.bookingOption.reward}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refer Option Card */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='p-6'>
            <div className='space-y-4 border-b pb-4'>
              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Your Name :</p>
                <p className='font-medium'>{rewardData.referOption.name}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Option (Refer Id) :</p>
                <p className='font-medium'>{rewardData.referOption.id}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Date :</p>
                <p className='font-medium'>{rewardData.referOption.date}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Refer Id :</p>
                <p className='font-medium text-red-500'>
                  {rewardData.referOption.referID}
                </p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Reward :</p>
                <p className='font-medium'>{rewardData.referOption.reward}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Status :</p>
                <p className='font-medium text-orange-500'>
                  {rewardData.referOption.status}
                </p>
              </div>
            </div>

            <div className='pt-4'>
              <p className='text-sm font-medium mb-2'>Withdraw mode</p>
              <div className='flex justify-between items-center mb-4'>
                <p className='text-sm text-gray-500'>UPI Id :</p>
                <p className='font-medium'>{rewardData.referOption.upiID}</p>
              </div>

              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-500'>Total :</p>
                <p className='font-medium text-red-500'>
                  {rewardData.referOption.reward}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
