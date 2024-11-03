// src/manager/api/branches.ts
import axiosInstance from './axiosInstance';
import { Branch } from '../utils/types';

export const getBranches = async (): Promise<Branch[]> => {
  const response = await axiosInstance.get('api/branches');
  return response.data;
};

export const getBranchById = async (id: number): Promise<Branch> => {
  const response = await axiosInstance.get(`api/branches/${id}`);
  return response.data;
};

export const createBranch = async (data: Partial<Branch>): Promise<Branch> => {
  const response = await axiosInstance.post('api/branches', data);
  return response.data;
};

export const updateBranch = async (id: number, data: Partial<Branch>): Promise<Branch> => {
  const response = await axiosInstance.put(`api/branches/${id}`, data);
  return response.data;
};

export const deleteBranch = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/branches/${id}`);
};
