// src/manager/api/services.ts
import axiosInstance from './axiosInstance';
import { Service } from '../utils/types';

export const getServices = async (): Promise<Service[]> => {
  const response = await axiosInstance.get('/services');
  return response.data;
};

export const getServiceById = async (id: number): Promise<Service> => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response.data;
};

export const createService = async (data: Partial<Service>): Promise<Service> => {
  const response = await axiosInstance.post('/services', data);
  return response.data;
};

export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
  const response = await axiosInstance.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/services/${id}`);
};
