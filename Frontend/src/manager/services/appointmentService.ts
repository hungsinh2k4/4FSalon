// src/manager/services/appointmentService.ts
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';
import { Appointment } from '../utils/types';

export const fetchAppointments = async (): Promise<Appointment[]> => {
  return await getAppointments();
};

export const fetchAppointment = async (id: number): Promise<Appointment> => {
  return await getAppointmentById(id);
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
