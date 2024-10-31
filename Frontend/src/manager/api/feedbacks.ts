// src/manager/api/feedbacks.ts
import axiosInstance from './axiosInstance';
import { Feedback } from '../utils/types';

export const getFeedbacks = async (): Promise<Feedback[]> => {
  const response = await axiosInstance.get('/feedbacks');
  return response.data;
};

export const getFeedbackById = async (id: number): Promise<Feedback> => {
  const response = await axiosInstance.get(`/feedbacks/${id}`);
  return response.data;
};

export const createFeedback = async (data: Partial<Feedback>): Promise<Feedback> => {
  const response = await axiosInstance.post('/feedbacks', data);
  return response.data;
};

export const updateFeedback = async (id: number, data: Partial<Feedback>): Promise<Feedback> => {
  const response = await axiosInstance.put(`/feedbacks/${id}`, data);
  return response.data;
};

export const deleteFeedback = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/feedbacks/${id}`);
};
