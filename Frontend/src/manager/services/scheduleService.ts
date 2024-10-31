// src/manager/services/scheduleService.ts
import { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } from '../api/schedules';
import { Schedule } from '../utils/types';

export const fetchSchedules = async (): Promise<Schedule[]> => {
  return await getSchedules();
};

export const fetchSchedule = async (id: number): Promise<Schedule> => {
  return await getScheduleById(id);
};

export const addSchedule = async (data: Partial<Schedule>): Promise<Schedule> => {
  return await createSchedule(data);
};

export const editSchedule = async (id: number, data: Partial<Schedule>): Promise<Schedule> => {
  return await updateSchedule(id, data);
};

export const removeSchedule = async (id: number): Promise<void> => {
  return await deleteSchedule(id);
};
