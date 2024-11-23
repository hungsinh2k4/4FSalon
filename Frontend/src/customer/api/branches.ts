import axiosInstance from './axiosInstance';
import { Branch } from '../utils/types';

export const getBranches = async (): Promise<Branch[]> => {
  console.log('getBranches loading');
  const response = await axiosInstance.get('api/branches');
  console.log('getBranches loaded');
  console.log(response.data);
  return response.data;
};