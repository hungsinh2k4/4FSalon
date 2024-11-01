// src/manager/api/accounts.ts
import axiosInstance from './axiosInstance';
import { Account } from '../utils/types';

export const getAccounts = async (): Promise<Account[]> => {
  const response = await axiosInstance.get<Account[]>('api/users');
  console.log(response.data);
  return response.data;
};

export const getAccountById = async (id: number): Promise<Account> => {
  const response = await axiosInstance.get(`/accounts/${id}`);
  return response.data;
};

export const createAccount = async (data: Partial<Account>): Promise<Account> => {
  const response = await axiosInstance.post('/accounts', data);
  return response.data;
};

export const updateAccount = async (id: number, data: Partial<Account>): Promise<Account> => {
  const response = await axiosInstance.put(`/accounts/${id}`, data);
  return response.data;
};

export const deleteAccount = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/accounts/${id}`);
};
