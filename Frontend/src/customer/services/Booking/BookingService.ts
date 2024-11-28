import { getBranches} from '../../api/branches';
import { Appointment, Branch } from '../../utils/types';

export const fetchBranches = async (): Promise<Branch[]> => {
  return await getBranches();
};

