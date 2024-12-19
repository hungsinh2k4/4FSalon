// src/manager/services/scheduleService.ts
import { getSchedules, getSchedulesByBranch, getScheduleById, createSchedule, updateSchedule, deleteSchedule, createAbsence, deleteAbsence, getAbsencesByBranch } from '../api/schedules';
import { Absence, Schedule } from '../utils/types';

export const fetchSchedules = async (): Promise<Schedule[]> => {
  return await getSchedules();
};

export const fetchSchedulesByBranch = async (branch_id: number): Promise<Schedule[]> => {
  return await getSchedulesByBranch(branch_id);
}

export const fetchSchedule = async (id: number): Promise<Schedule> => {
  return await getScheduleById(id);
};

export const fetchAbsencesByBranch = async (branch_id: number): Promise<Absence[]> => {
  return await getAbsencesByBranch(branch_id);
};

export const addSchedule = async (data: Partial<Schedule>): Promise<Schedule> => {
  return await createSchedule(data);
};

export const addAbsence = async (data: Partial<Absence>): Promise<Absence> => {
  return await createAbsence(data);
}

export const removeAbsence = async (id: number): Promise<void> => {
  return await deleteAbsence(id);
}

export const editSchedule = async (data: Partial<Schedule>): Promise<Schedule> => {
  return await updateSchedule(data);
};

export const removeSchedule = async (id: number): Promise<void> => {
  return await deleteSchedule(id);
};