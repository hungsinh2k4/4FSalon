// src/manager/services/serviceService.ts
import { getServices, getServiceById, createService, updateService, deleteService } from '../api/services';
import { Service } from '../utils/types';

export const fetchServices = async (): Promise<Service[]> => {
  return await getServices();
};

export const fetchService = async (id: number): Promise<Service> => {
  return await getServiceById(id);
};

export const addService = async (data: Partial<Service>): Promise<Service> => {
  return await createService(data);
};

export const editService = async (id: number, data: Partial<Service>): Promise<Service> => {
  return await updateService(id, data);
};

export const removeService = async (id: number): Promise<void> => {
  return await deleteService(id);
};
