// src/manager/api/appointments.ts
import axiosInstance from './axiosInstance';
import { Appointment } from '../utils/types';

export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await axiosInstance.get('api/appointments');
  return response.data;
};

export const getAppointmentById = async (id: number): Promise<Appointment> => {
  const response = await axiosInstance.get(`api/appointments/${id}`);
  return response.data;
};

export const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  const response = await axiosInstance.post('api/appointments', data);
  return response.data;
};

export const updateAppointment = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
  const response = await axiosInstance.put(`api/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/appointments/${id}`);
};
