import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to='/login'
      replace
    />
  );
};
