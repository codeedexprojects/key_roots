import { useState } from 'react';
import { AuthContext } from './authContext';

const storedToken = localStorage.getItem('authToken');
const initialToken =
  storedToken && storedToken !== 'null' && storedToken !== 'undefined'
    ? storedToken
    : null;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(initialToken);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
