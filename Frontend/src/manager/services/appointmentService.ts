// src/manager/services/appointmentService.ts
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getAppointmentsWithParams, updateCustomer } from '../api/appointments';
import { Appointment, Customer } from '../utils/types';

export const fetchAppointments = async (): Promise<Appointment[]> => {
  return await getAppointments();
};

export const fetchAppointment = async (id: number): Promise<Appointment> => {
  return await getAppointmentById(id);
};

export const fetchAppointmentsWithParams = async (params: any): Promise<Appointment[]> => {
  return await getAppointmentsWithParams(params);
}; 

export const addAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  return await createAppointment(data);
};

export const editAppointment = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
  return await updateAppointment(id, data);
};

export const removeAppointment = async (id: number): Promise<void> => {
  return await deleteAppointment(id);
};

export const editCustomer = async (id: number, data: Partial<Customer>): Promise<Customer> => {
  return await updateCustomer(id, data);
}
