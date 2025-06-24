import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllRewards } from '../services/rewardsService';

export const RewardsListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllRewards();
        const data =
          response.data && Array.isArray(response.data) ? response.data : [];
        setRewards(
          data.map((reward) => ({
            id: reward.id,
            name: reward.name,
            date: new Date(reward.created_at).toLocaleDateString('en-US', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }),
            referID: reward.refer_id,
            amount: `$${parseFloat(reward.reward_amount).toFixed(2)}`,
            status: reward.status_text,
            source: reward.booking_type === 'bus' ? 'Booking' : 'Invite friend',
          }))
        );
      } catch (err) {
        setError('Failed to load rewards');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRewards = rewards.filter((reward) => {
    if (searchTerm === '') return true;
    return (
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.referID.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const rewardsPerPage = 5;
  const totalPages = Math.ceil(filteredRewards.length / rewardsPerPage);
  const indexOfLastReward = currentPage * rewardsPerPage;
  const indexOfFirstReward = indexOfLastReward - rewardsPerPage;
  const currentRewards = filteredRewards.slice(
    indexOfFirstReward,
    indexOfLastReward
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const handleRowClick = (rewardId) => {
    navigate(`/admin/rewards/${rewardId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (filteredRewards.length === 0) {
    return (
      <div className='flex-1 overflow-auto'>
        <h1 className='text-2xl font-semibold mb-6'>Rewards</h1>
        <div className='mb-6'>
          <div className='relative w-full md:w-64'>
            <input
              type='text'
              placeholder='Search by name or refer ID...'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
          <p className='text-gray-500'>No rewards found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-auto'>
      <h1 className='text-2xl font-semibold mb-6'>Rewards</h1>

      {/* Search */}
      <div className='mb-6'>
        <div className='relative w-full md:w-64'>
          <input
            type='text'
            placeholder='Search by name or refer ID...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
        </div>
      </div>

      {/* Rewards Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                {['Name', 'Date', 'Refer ID', 'Amount', 'Status', 'Source'].map(
                  (header, i) => (
                    <th
                      key={i}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentRewards.map((reward) => (
                <tr
                  key={reward.id}
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleRowClick(reward.id)}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <img
                        className='h-10 w-10 rounded-md'
                        src='https://img.freepik.com/premium-vector/booking-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg'
                        alt=''
                      />
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {reward.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>{reward.date}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-red-500 font-medium'>
                      {reward.referID}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium'>{reward.amount}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className={`text-sm font-medium ${getStatusColor(
                        reward.status
                      )}`}>
                      {reward.status}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>{reward.source}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='px-6 py-4 bg-white border-t border-gray-200'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              Showing{' '}
              <span className='font-medium'>{indexOfFirstReward + 1}</span> to{' '}
              <span className='font-medium'>
                {Math.min(indexOfLastReward, filteredRewards.length)}
              </span>{' '}
              of <span className='font-medium'>{filteredRewards.length}</span>{' '}
              rewards
            </div>

            <div className='flex space-x-1'>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <span className='sr-only'>Previous</span>
                <ChevronLeft className='h-5 w-5' />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } rounded-md`}>
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <span className='sr-only'>Next</span>
                <ChevronRight className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
