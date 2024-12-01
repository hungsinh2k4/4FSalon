import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import { useLocation } from "react-router-dom";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "nav-items text-blue-400 border-b-2 border-blue-200"
      : "text-gray-600 hover:text-blue-400 hover:border-b-2 hover:border-blue-200";
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    try {
      // Gửi yêu cầu thay đổi mật khẩu đến backend
      console.log("currentPassword", currentPassword);
      console.log("newPassword", newPassword);
      await authService.changePassword(currentPassword, newPassword);
      // Thay đổi mật khẩu thành công
      // Xóa dữ liệu cũ
      setSuccess("Thay đổi mật khẩu thành công");
      setError("");
    } catch (error: any) {
      setError("Thay đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-6 flex space-x-4 mx-4 mb-4">
        <Link to="/" className={getLinkClass("/")}>
          Home
        </Link>
        <p>/</p>
        <Link to="/profile" className={getLinkClass("/profile")}>
          Profile
        </Link>
        <p>/</p>
        <Link
          to="/change-password"
          className={getLinkClass("/change-password")}
        >
          Change Password
        </Link>
      </div>
      <form
        className="bg-white p-4 rounded-lg shadow-md border"
        onSubmit={handleChangePassword}
      >
        <h1 className="text-2xl font-bold mb-4">Thay đổi mật khẩu</h1>
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium"
          >
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm mb-4">{success}</div>
        )}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Thay đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
