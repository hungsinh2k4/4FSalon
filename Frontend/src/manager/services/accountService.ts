// src/manager/services/accountService.ts
import { getAccounts, getAccountById, createAccount, updateAccount, deleteAccount } from '../api/accounts';
import { Account } from '../utils/types';

export const fetchAccounts = async (): Promise<Account[]> => {
  return await getAccounts();
};

export const fetchAccount = async (id: number): Promise<Account> => {
  return await getAccountById(id);
};

export const addAccount = async (data: Partial<Account>): Promise<Account> => {
  return await createAccount(data);
};

export const editAccount = async (id: number, data: Partial<Account>): Promise<Account> => {
  return await updateAccount(id, data);
};

export const removeAccount = async (id: number): Promise<void> => {
  return await deleteAccount(id);
};
