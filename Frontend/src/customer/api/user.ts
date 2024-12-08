// src/customer/api/accounts.ts
import axiosInstance from "./axiosInstance";
import { Feedback, MyAppointment, User, Customer } from "../utils/types";

export const getUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("api/users/profile");
  // console.log(response.data);
  return response.data;
};
export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.post("api/users", data);
  return response.data;
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.patch("api/users/profile", data);
  return response.data;
};

export const getAppointmentList = async (
  params: string
): Promise<MyAppointment[]> => {
  const response = await axiosInstance.get<MyAppointment[]>(
    `api/appointments/search?${params}`
  );
  return response.data;
};

export const cancelAppointment = async (
  data: Partial<MyAppointment>
): Promise<MyAppointment> => {
  const response = await axiosInstance.put(`api/appointments/${data.id}`, data);
  return response.data;
};

export const postFeedback = async (
  data: Partial<Feedback>
): Promise<Feedback> => {
  const response = await axiosInstance.post(`api/feedbacks`, data);
  return response.data;
};
export const getCustomerProfileByUserId = async (
  id: number
): Promise<Customer> => {
  const response = await axiosInstance.get(`api/customers/${id}`);
  return response.data;
};
