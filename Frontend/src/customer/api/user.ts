// src/customer/api/accounts.ts
import axiosInstance from "./axiosInstance";
import { User } from "../utils/types";

export const getUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("api/users/profile");
  console.log(response.data);
  return response.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.post("api/users", data);
  return response.data;
};

export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
  const response = await axiosInstance.patch(`api/users/${id}`, data);
  return response.data;
};
