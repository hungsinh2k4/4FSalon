// src/manager/services/employeeService.ts
import { getEmployees, getEmployeeById, getEmployeeByBranchId,createEmployee, updateEmployee, deleteEmployee,getEmployeeDate,getEmployeeSchedule } from '../../api/employees';
import { Employee, Employee_date } from '../../utils/types';

export const fetchEmployees = async (): Promise<Employee[]> => {
  return await getEmployees();
};

export const fetchEmployee = async (id: number): Promise<Employee> => {
  return await getEmployeeById(id);
};
export const fetchEmployeebyBranchId = async (id: number | undefined): Promise<Employee> => {
  return await getEmployeeByBranchId(id);
};
export const addEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  return await createEmployee(data);
};

export const editEmployee = async (id: number, data: Partial<Employee>): Promise<Employee> => {
  return await updateEmployee(id, data);
};
export const fetchEmployeeSchedule = async (id: number | undefined, date : Date | undefined): Promise<Date[]> => {
  return await getEmployeeSchedule(id,date);
};
export const removeEmployee = async (id: number): Promise<void> => {
  return await deleteEmployee(id);
};
export const fetchEmployeeDate = async (id: number, date: Date): Promise<Employee_date> => {
  return await getEmployeeDate(id, date);
}
export const fetchCustomerProfileByUserId = async (id: number): Promise<Employee> => {
  return await getEmployeeById(id);
}