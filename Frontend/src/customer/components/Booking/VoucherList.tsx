import React from "react";
import { Voucher, Service, User } from "../../utils/types";

interface VoucherListProps {
  viewType: string;
  vouchers: Voucher[];
  selectedVoucher: Voucher | null;
  setSelectedVoucher: React.Dispatch<React.SetStateAction<Voucher | null>>;
  selectedService: Service | null; // Giá trị dịch vụ đã chọn
  user: User | null; // Số điểm của người dùng
  selectedDate: Date | undefined; // Ngày được truyền vào để kiểm tra điều kiện
  searchTerm: String;
}

const VoucherList: React.FC<VoucherListProps> = ({
  viewType,
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
  selectedService,
  user,
  selectedDate, // Nhận ngày từ props
  searchTerm,
}) => {
  // Hàm kiểm tra xem voucher có hợp lệ với các điều kiện không
  const isVoucherValid = (voucher: Voucher): boolean => {
    if (selectedDate === undefined) return false; // Nếu không có ngày thì không hợp lệ
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);
    const isDateInRange = selectedDate >= startDate && selectedDate <= endDate; // Sử dụng selectedDate
    const isPriceValid =
      (selectedService?.price ?? 0) >= voucher.price_threshold;
    const isPointsValid = Number(user?.points) >= voucher.required_point;

    return isDateInRange && isPriceValid && isPointsValid;
  };

  if (viewType !== "voucher") return null;
  if (!selectedService) {
    selectedVoucher = null;
  } // Nếu không có dịch vụ nào được chọn thì vô hiệu hóa voucher
  return (
    <div className="container mx-auto max-h-[500px] p-4 overflow-y-auto">
      {vouchers
      .filter((voucher) => voucher.code.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((voucher) => {
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
          className={`w-full max-h-[300px] my-2.5 pb-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
          selectedVoucher?.id === voucher.id
            ? "bg-blue-700 border-blue-950" // Style khi được chọn
            : "bg-gray-100 border-[#0a0a0a]"
          } cursor-pointer text-left flex ${!valid ? "opacity-50" : ""}`}
        >
          <div className="w-28 h-28 overflow-hidden rounded-t-lg">
          <img
            src="src/customer/assets/Booking/employees.jpeg"
            alt={voucher.description}
            className="w-full h-full object-cover overflow-hidden rounded-s-lg"
          />
          </div>
          <div className="flex-1 p-4">
          <strong>{voucher.code}</strong>
          <div className="text-sm text-gray-600">
            Giá dịch vụ yêu cầu: {voucher.price_threshold}
          </div>
          <div className="text-sm text-gray-600">
            {voucher.discount_type === "percentage" ? `${voucher.discount_value}%` : `${voucher.discount_value} VNĐ`}
          </div>
          <div className="text-sm text-gray-600 justify-center">
            Điểm yêu cầu: {voucher.required_point}
          </div>
          </div>
        </button>
        );
      })}
    </div>
  );
};

export default VoucherList;
