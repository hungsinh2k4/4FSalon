import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import authService from "../services/authService";
export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp. Vui lòng thử lại.");
      return;
    }
    try {
      console.log("token", token);
      const response = await authService.resetPassword(token || "", password);
      console.log(response);
      setMessage("Mật khẩu của bạn đã được đặt lại thành công.");
      navigate("/login");
    } catch (error) {
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded shadow-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Đặt lại mật khẩu
        </h1>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Nhập lại mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Đặt lại mật khẩu
        </button>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
};
