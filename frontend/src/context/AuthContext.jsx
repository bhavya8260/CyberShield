/* eslint-disable react/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { getAuthToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (userData) => {
    const response = await authService.login(userData);
    setUser(response);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
