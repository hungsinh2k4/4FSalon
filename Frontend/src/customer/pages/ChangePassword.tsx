import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook để điều hướng
import authService from "../services/authService"; // Dịch vụ thay đổi mật khẩu
import { toast } from "react-toastify"; // Thư viện hiển thị thông báo
const ChangePassword: React.FC = () => {
  const navigate = useNavigate(); // Hook điều hướng
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }
  };
  function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === "object" && error !== null && "message" in error;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới có khớp hay không
    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp.");
      setError("Mật khẩu mới và xác nhận mật khẩu mới không khớp.");
      return;
    }

    try {
      setLoading(true);
      // Gọi dịch vụ thay đổi mật khẩu
      const response = await authService.changePassword(
        oldPassword,
        newPassword
      );
      console.log(response);
      toast.success("Mật khẩu đã được thay đổi thành công");
      setSuccessMessage("Mật khẩu đã được thay đổi thành công.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // Bạn có thể chuyển hướng người dùng trở lại trang profile nếu cần
      setTimeout(() => {
        navigate("/"); // Quay lại trang Profile sau khi thay đổi mật khẩu
      }, 2000);
    } catch (err) {
      if (isErrorWithMessage(err) && err.message === "Token not found") {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        // Điều hướng người dùng đến trang đăng nhập
        navigate("/");
      } else {
        setError("Đã có lỗi xảy ra khi thay đổi mật khẩu.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg border mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm mt-2">{successMessage}</p>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
