import {
  Package,
  PlusCircle,
  AlertCircle,
  Bus,
  Home,
  Users,
  Store,
  Star,
  CalendarDays,
  CreditCard,
  Megaphone,
  Grid,
  Medal,
  DollarSign,
} from 'lucide-react';

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'default',
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'package':
        return <Package className='h-5 w-5 text-gray-700' />;
      case 'bus':
        return <Bus className='h-5 w-5 text-gray-700' />;
      case 'dashboard':
        return <Home className='h-5 w-5 text-gray-700' />;
      case 'users':
        return <Users className='h-5 w-5 text-gray-700' />;
      case 'vendor':
        return <Store className='h-5 w-5 text-gray-700' />;
      case 'reviews':
        return <Star className='h-5 w-5 text-gray-700' />;
      case 'booking':
        return <CalendarDays className='h-5 w-5 text-gray-700' />;
      case 'payments':
        return <CreditCard className='h-5 w-5 text-gray-700' />;
      case 'advertisement':
        return <Megaphone className='h-5 w-5 text-gray-700' />;
      case 'category':
        return <Grid className='h-5 w-5 text-gray-700' />;
      case 'reward':
        return <Medal className='h-5 w-5 text-gray-700' />;
      case 'payout':
        return <DollarSign className='h-5 w-5 text-gray-700' />;
      case 'error':
        return <AlertCircle className='h-5 w-5 text-red-500' />;
      default:
        return <PlusCircle className='h-5 w-5 text-gray-700' />;
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
