import axiosInstance from './axiosInstance';
import { Branch } from '../utils/types';

export const getBranches = async (): Promise<Branch[]> => {
  const response = await axiosInstance.get('api/branches');
  
  return response.data;
};