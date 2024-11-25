import {  createAppointment } from '../../api/appointment';
import { Appointment, Branch, Voucher } from '../../utils/types';

export const fetchcreateAppointment = async (data : Partial<Appointment>): Promise<Appointment> => {
  return await createAppointment(data);
};
