
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  
  // Check if the user is already authenticated on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const user = AuthService.getCurrentUser(storedToken);
      if (user) {
        setUser(user);
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    const result = AuthService.login(email, password);
    
    if (result) {
      setUser(result.user);
      setToken(result.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', result.token);
      return true;
    }
    
    return false;
  };
  
  const register = async (name: string, email: string, password: string) => {
    const result = AuthService.register(name, email, password);
    
    if (result) {
      setUser(result.user);
      setToken(result.token);
      setIsAuthenticated(true);
      localStorage.setItem('token', result.token);
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };
  
  const value = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
