import {  createAppointment } from '../../api/appointment';
import { Appointment, Branch, Voucher } from '../../utils/types';

export const addAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
  return await createAppointment(data);
};
