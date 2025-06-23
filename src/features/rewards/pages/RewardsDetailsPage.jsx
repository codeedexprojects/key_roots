import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getRewardById } from '../services/rewardsService';

export const RewardDetailsPage = () => {
  const { rewardId } = useParams();
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRewardById(rewardId);
        console.log(data);
        setReward({
          id: data.id,
          name: data.name,
          date: new Date(data.created_at).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          referID: data.refer_id,
          reward: `$${parseFloat(data.reward_amount).toFixed(2)}`,
          status: data.status_text,
          upiID: data.upi_id || 'N/A', // Fallback if upi_id not provided
          optionId: data.booking_type === 'bus' ? data.id : `REF-${data.id}`, // Mock option ID
          type: data.booking_type === 'bus' ? 'booking' : 'refer',
        });
      } catch (err) {
        setError('Failed to load reward details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rewardId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!reward) return <div>No reward found</div>;

  const renderCard = (option, title) => (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      <div className='p-6'>
        <div className='space-y-4 border-b pb-4'>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Your Name :</p>
            <p className='font-medium'>{option.name}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>{title} :</p>
            <p className='font-medium'>{option.optionId}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Date :</p>
            <p className='font-medium'>{option.date}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Refer Id :</p>
            <p className='font-medium text-red-500'>{option.referID}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Reward :</p>
            <p className='font-medium'>{option.reward}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Status :</p>
            <p className={`font-medium ${getStatusColor(option.status)}`}>
              {option.status}
            </p>
          </div>
        </div>
        <div className='pt-4'>
          <p className='text-sm font-medium mb-2'>Withdraw mode</p>
          <div className='flex justify-between items-center mb-4'>
            <p className='text-sm text-gray-500'>UPI Id :</p>
            <p className='font-medium'>{option.upiID}</p>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Total :</p>
            <p className='font-medium text-red-500'>{option.reward}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Withdraw':
        return 'text-orange-500';
      case 'Completed':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className='flex-1 overflow-auto'>
      <div className='mb-6'>
        <Link
          to='/rewards'
          className='inline-flex items-center text-gray-600 hover:text-gray-900'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          <span>Back</span>
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {reward.type === 'booking' ? (
          <>
            {renderCard(reward, 'Option (Booking Id)')}
            <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
              <p className='text-gray-500'>No refer option available</p>
            </div>
          </>
        ) : (
          <>
            <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
              <p className='text-gray-500'>No booking option available</p>
            </div>
            {renderCard(reward, 'Option (Refer Id)')}
          </>
        )}
      </div>
    </div>
  );
};
