import { Voucher } from "../../utils/types";
import { getVoucherByBranchId } from "../../api/voucher";

export const fetchVoucherbyBranchId = async (id: number | undefined): Promise<Voucher> => {
  return await getVoucherByBranchId(id);
};
