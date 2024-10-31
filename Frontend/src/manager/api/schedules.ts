// src/manager/api/schedules.ts
import axiosInstance from './axiosInstance';
import { Schedule } from '../utils/types';

export const getSchedules = async (): Promise<Schedule[]> => {
  const response = await axiosInstance.get('/schedules');
  return response.data;
};

export const getScheduleById = async (id: number): Promise<Schedule> => {
  const response = await axiosInstance.get(`/schedules/${id}`);
  return response.data;
};

export const createSchedule = async (data: Partial<Schedule>): Promise<Schedule> => {
  const response = await axiosInstance.post('/schedules', data);
  return response.data;
};

export const updateSchedule = async (id: number, data: Partial<Schedule>): Promise<Schedule> => {
  const response = await axiosInstance.put(`/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/schedules/${id}`);
};
