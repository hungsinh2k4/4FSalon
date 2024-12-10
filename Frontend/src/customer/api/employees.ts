// src/customer/api/employees.ts
import axiosInstance from "./axiosInstance";
import { Employee, Employee_date, Schedule } from "../utils/types";

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await axiosInstance.get("api/employees");
  console.log(response.data);
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await axiosInstance.get(`api/employees/${id}`);
  return response.data;
};

export const getEmployeeByBranchId = async (
  id: number | undefined
): Promise<Employee> => {
  const response = await axiosInstance.get(
    `api/employees/search?branch_id=${id}`
  );
  return response.data;
};

export const getEmployeeSchedule = async (
  id: number | undefined,
  date: Date | undefined
): Promise<Schedule[]> => {
  const response = await axiosInstance.get(
    `api/employees/${id}/available/${date}`
  );
  return response.data;
};
export const createEmployee = async (
  data: Partial<Employee>
): Promise<Employee> => {
  const response = await axiosInstance.post("api/employees", data);
  return response.data;
};

export const updateEmployee = async (
  id: number,
  data: Partial<Employee>
): Promise<Employee> => {
  const response = await axiosInstance.put(`api/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/employees/${id}`);
};

export const getEmployeeDate = async (
  id: number,
  date: Date
): Promise<Employee_date> => {
  const response = await axiosInstance.get(
    `api/employees/${id}/avaiable/${date}`
  );
  return response.data;
};
