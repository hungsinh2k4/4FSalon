// src/manager/services/feedbackService.ts
import { getFeedbacks, getFeedbackById, createFeedback, updateFeedback, deleteFeedback } from '../api/feedbacks';
import { Feedback } from '../utils/types';

export const fetchFeedbacks = async (): Promise<Feedback[]> => {
  return await getFeedbacks();
};

export const fetchFeedback = async (id: number): Promise<Feedback> => {
  return await getFeedbackById(id);
};

export const addFeedback = async (data: Partial<Feedback>): Promise<Feedback> => {
  return await createFeedback(data);
};

export const editFeedback = async (id: number, data: Partial<Feedback>): Promise<Feedback> => {
  return await updateFeedback(id, data);
};

export const removeFeedback = async (id: number): Promise<void> => {
  return await deleteFeedback(id);
};
