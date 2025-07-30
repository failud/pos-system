import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState, User } from '../types/AuthType';
import { getTokenFromCookies, getUserFromCookies, removeAuthCookies, setAuthCookies } from '../utils/auth';
import apiClient from '../api';


interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  /**
   * Check if user is authenticated on app start
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = getTokenFromCookies();
      const user = getUserFromCookies();

      if (token && user) {
        try {
          // Verify token with backend
          await apiClient.get('/auth/verify');
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token invalid, clear cookies
          removeAuthCookies();
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    setAuthCookies(token, user);
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    removeAuthCookies();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    // Redirect to login page
    window.location.href = '/';
  };

  const checkAuth = async () => {
    const token = getTokenFromCookies();
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await apiClient.get('/auth/verify');
      if (response.data.user) {
        setAuthState(prev => ({
          ...prev,
          user: response.data.user,
          isAuthenticated: true,
        }));
      }
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};