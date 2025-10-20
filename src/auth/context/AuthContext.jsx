import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = authService.getCurrentUser();
      if (user) {
        try {
          setCurrentUser(user);
          authService.setupAxiosInterceptors(user.token);
        } catch (error) {
          authService.logout();
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setCurrentUser(data);
      authService.setupAxiosInterceptors(data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser,

    // Roles 
    isSuperuser: currentUser?.roles?.includes('ROL_SUPERUSUARIO') || false,
    isAdmin: currentUser?.roles?.includes('ROL_ADMINISTRADOR') || false,
    isClient: currentUser?.roles?.includes('ROL_CLIENTE') || false,

    //  Roles disponibles como array
    roles: currentUser?.roles || []
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
