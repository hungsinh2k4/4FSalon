// src/manager/api/auth.ts
import axiosInstance from './axiosInstance';

interface LoginResponse {
  token: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login-admin', { username, password });
  console.log(response.data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};
