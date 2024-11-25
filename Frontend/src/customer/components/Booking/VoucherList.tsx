import React from "react";
import { Voucher ,Service, User} from "../../utils/types";

interface VoucherListProps {
  viewType: string;
  vouchers: Voucher[];
  selectedVoucher: Voucher | null;
  setSelectedVoucher: React.Dispatch<React.SetStateAction<Voucher | null>>;
  selectedService: Service | null ; // Giá trị dịch vụ đã chọn
  user: User | null; // Số điểm của người dùng
  selectedDate: Date; // Ngày được truyền vào để kiểm tra điều kiện
}

const VoucherList: React.FC<VoucherListProps> = ({
  viewType,
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
  selectedService,
  user,
  selectedDate, // Nhận ngày từ props
}) => {
  // Hàm kiểm tra xem voucher có hợp lệ với các điều kiện không
  const isVoucherValid = (voucher: Voucher): boolean => {
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);
    const isDateInRange = selectedDate >= startDate && selectedDate <= endDate; // Sử dụng selectedDate
    const isPriceValid = selectedService?.price >= voucher.price_threshold;
    const isPointsValid = (Number (user?.points) >= voucher.required_point);

    console.log("isDateInRange", isDateInRange);
    console.log("isPriceValid", isPriceValid);
    console.log("isPointsValid", isPointsValid);
    console.log("selectedService?.price", selectedService?.price);
    console.log("voucher.price_threshold", voucher.price_threshold);
    console.log("user?.point", user?.points);
    console.log("voucher.required_point", voucher.required_point);
    console.log("selectedDate", selectedDate);
    console.log("startDate", startDate);
    return isDateInRange && isPriceValid && isPointsValid;
  };

  if (viewType !== "voucher") return null;

  return (
    <div className="mt-2.5 max-h-[500px] overflow-y-auto border border-gray-300 rounded-s-lg p-2 grid grid-cols-2 gap-3.5">
      {vouchers.map((voucher) => {
        const valid = isVoucherValid(voucher); // Kiểm tra điều kiện voucher
        return (
          <button
            key={voucher.id}
            onClick={() =>
              setSelectedVoucher(
                selectedVoucher?.id === voucher.id ? null : voucher
              )
            }
            disabled={!valid} // Vô hiệu hóa nút nếu voucher không hợp lệ
            className={`w-full py-6.5 h-[400px] my-2.5 ${
              selectedVoucher?.id === voucher.id
                ? "bg-blue-700 border-blue-950" // Style khi được chọn
                : "bg-gray-100 border-[#0a0a0a]"
            } cursor-pointer text-left flex ${!valid ? "opacity-50" : ""}`}
          >
            <div className="w-2/5 h-full overflow-hidden">
              <img
                src="src/customer/assets/Booking/employees.jpeg"
                alt={voucher.description}
                className="w-full h-full object-cover overflow-hidden rounded-s-lg"
              />
            </div>
            <div className="flex-1 p-4">
              <strong>{voucher.discount_type}</strong>
              <div className="text-sm text-gray-600">
                {voucher.price_threshold}
              </div>
              <div className="text-sm text-gray-600">
                {voucher.discount_value}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VoucherList;
