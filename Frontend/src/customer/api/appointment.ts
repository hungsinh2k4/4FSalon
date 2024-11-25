import axiosInstance from './axiosInstance';
import { Appointment } from '../utils/types';

export const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  const response = await axiosInstance.post('api/appointments', data);
  return response.data;
};