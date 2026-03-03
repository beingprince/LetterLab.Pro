import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');

        const storedUser = localStorage.getItem('letterlab_user');

        if (storedToken) {
          const decoded = jwtDecode(storedToken);

          // Check if token is expired
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            setToken(storedToken);

            if (storedUser) {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } else {
              // Create user object from token
              setUser({
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
              });
            }
          } else {
            // Token expired, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('letterlab_user');
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('letterlab_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'letterlab_user') {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login function
  const login = useCallback((userData, authToken) => {
    try {
      const decoded = jwtDecode(authToken);

      setUser(userData);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('letterlab_user', JSON.stringify(userData));

      // Dispatch custom event for other components
      window.dispatchEvent(new Event('llp_auth_changed'));

      setError(null);
    } catch (err) {
      setError('Invalid authentication data');
      throw err;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);

    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('letterlab_user');

    // Dispatch custom event
    window.dispatchEvent(new Event('llp_auth_changed'));
  }, []);

  // Check if token is valid
  const isTokenValid = useCallback(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp && decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, [token]);

  // Get auth headers
  const getAuthHeaders = useCallback(() => {
    if (!token || !isTokenValid()) {
      return null;
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, [token, isTokenValid]);

  // Check authentication status
  const isAuthenticated = useCallback(() => {
    return !!user && !!token && isTokenValid();
  }, [user, token, isTokenValid]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isTokenValid,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};