import { getBranches} from '../api/branches';
import { Branch } from '../utils/types';

export const fetchBranches = async (): Promise<Branch[]> => {
  return await getBranches();
};
