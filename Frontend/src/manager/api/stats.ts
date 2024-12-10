// src/manager/api/services.ts
import axiosInstance from './axiosInstance';
import { Statistic } from '../utils/types';

export const getStats = async (params: any): Promise<Statistic> => {
  const urlParams = new URLSearchParams(params).toString();
  const response = await axiosInstance.get('api/stats?' + urlParams);
  return response.data;
};
