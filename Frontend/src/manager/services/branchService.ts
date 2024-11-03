// src/manager/services/branchService.ts
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from '../api/branches';
import { Branch } from '../utils/types';

export const fetchBranches = async (): Promise<Branch[]> => {
  return await getBranches();
};

export const fetchBranch = async (id: number): Promise<Branch> => {
  return await getBranchById(id);
};

export const addBranch = async (data: Partial<Branch>): Promise<Branch> => {
  return await createBranch(data);
};

export const editBranch = async (id: number, data: Partial<Branch>): Promise<Branch> => {
  return await updateBranch(id, data);
};

export const removeBranch = async (id: number): Promise<void> => {
  return await deleteBranch(id);
};
