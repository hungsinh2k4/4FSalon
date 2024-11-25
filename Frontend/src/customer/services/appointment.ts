import { Appointment } from "../utils/types";
import { createAppointment } from "../api/appointment";

export const addBranch = async (data: Partial<Appointment>): Promise<Appointment> => {
  return await createAppointment(data);
};