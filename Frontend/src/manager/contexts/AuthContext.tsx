// src/manager/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from '../api/axiosInstance';

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  token: null,
  login: async () => {},
  logout: () => {},
});

interface LoginResponse {
  token: string;
}
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  console.log("login");
  const login = async (username: string, password: string) => {
    try {
      console.log("l123123ogin");
      console.log({ email: username, password: password });
      const response = await axios.post<LoginResponse>('/auth/login-admin', { email: username, password: password });
      //const response = await axios.post<LoginResponse>('http://localhost:3000/auth/login-admin', { email: "string@gmail.com", password: "string" });
      const receivedToken = response.data.token;
      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      console.log('Login successfully');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
