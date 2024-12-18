import {  createAppointment,updateAppointment } from '../../api/appointment';
import { Appointment } from '../../utils/types';

export const addAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  return await createAppointment(data);
};

export const changeAppointment = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
  return await updateAppointment(id,data);
}
