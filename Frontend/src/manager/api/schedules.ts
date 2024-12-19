// src/manager/api/schedules.ts
import axiosInstance from './axiosInstance';
import { Absence, Schedule } from '../utils/types';

export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await axiosInstance.get('api/schedules');
  return response.data;
};

export const getSchedulesByBranch = async (branch_id: number): Promise<Schedule[]> => {
  const response = await axiosInstance.get(`api/schedules/branch/${branch_id}`);
  return response.data;
};

export const getScheduleById = async (id: number): Promise<Schedule> => {
  const response = await axiosInstance.get(`api/schedules/${id}`);
  return response.data;
};

export const getAbsencesByBranch = async (branch_id: number): Promise<Absence[]> => {
  const response = await axiosInstance.get(`api/schedules/specific-off-days/branch/${branch_id}`);
  return response.data;
}

export const createSchedule = async (data: Partial<Schedule>): Promise<Schedule> => {
  const response = await axiosInstance.post('api/schedules', data);
  return response.data;
};

export const createAbsence = async (data: Partial<Absence>): Promise<Absence> => {
  const response = await axiosInstance.post('api/schedules/specific-off-days', data);
  return response.data;
}

export const updateSchedule = async (data: Partial<Schedule>): Promise<Schedule> => {
  const response = await axiosInstance.put(`api/schedules`, data);
  return response.data;
};

export const deleteSchedule = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/schedules/${id}`);
};

export const deleteAbsence = async (id: number): Promise<void> => {
  await axiosInstance.delete(`api/schedules/specific-off-days/${id}`);
}