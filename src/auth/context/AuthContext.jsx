import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = authService.getCurrentUser();
      if (user && user.token) {
        try {
          setCurrentUser(user);
          authService.setupAxiosInterceptors(user.token);
          console.log('Usuario recuperado:', user.username);
        } catch (error) {
          console.error('Error recuperando usuario:', error);
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
      console.log('Iniciando login para:', username);
      const data = await authService.login(username, password);
      setCurrentUser(data);
      console.log('Login exitoso, usuario:', data.username);
      return data;
    } catch (error) {
      console.error('Error en login:', error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('Cerrando sesión');
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isSuperuser: currentUser?.roles?.includes('ROLE_SUPERUSUARIO') || false,
    isAdmin: currentUser?.roles?.includes('ROLE_ADMINISTRADOR') || false,
    isClient: currentUser?.roles?.includes('ROLE_CLIENTE') || false,
    roles: currentUser?.roles || []
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};