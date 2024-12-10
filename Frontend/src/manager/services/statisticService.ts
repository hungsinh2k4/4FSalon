// src/manager/services/serviceService.ts
import { getStats } from '../api/stats';
import { Statistic } from '../utils/types';

export const fetchStatistic = async (params?: any): Promise<Statistic> => {
  return await getStats(params);
};