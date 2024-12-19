// src/manager/api/services.ts
import axiosInstance from './axiosInstance';
import { Service } from '../utils/types';

export const getServices = async (): Promise<Service[]> => {
  const response = await axiosInstance.get('api/services');
  return response.data;
};

export const getServiceById = async (id: number): Promise<Service> => {
  const response = await axiosInstance.get(`api/services/${id}`);
  return response.data;
};

export const createService = async (data: Partial<Service>): Promise<Service> => {
  const response = await axiosInstance.post('api/services', data);
  return response.data;
};

export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
  const response = await axiosInstance.put(`api/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/services/${id}`);
};
