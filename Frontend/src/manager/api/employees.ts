// src/manager/api/employees.ts
import axiosInstance from './axiosInstance';
import { Employee } from '../utils/types';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await axiosInstance.get('api/employees');
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await axiosInstance.get(`api/employees/${id}`);
  return response.data;
};

export const getEmployeeByBranchId = async (branchId: number): Promise<Employee[]> => {
  const response = await axiosInstance.get(`api/employees/search?branch_id=${branchId}`);
  return response.data;
}

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  const response = await axiosInstance.post('api/employees', data);
  return response.data;
};

export const updateEmployee = async (id: number, data: Partial<Employee>): Promise<Employee> => {
  const response = await axiosInstance.put(`api/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/employees/${id}`);
};
