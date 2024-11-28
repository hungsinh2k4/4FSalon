// src/manager/api/employees.ts
import axiosInstance from './axiosInstance';
import { Voucher } from '../utils/types';

export const getVoucherByBranchId = async (id: number | undefined): Promise<Voucher> => {
  const response = await axiosInstance.get(`api/vouchers/search?branch_id=${id}`);
  return response.data;
};
