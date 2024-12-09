import React, { useState } from "react";
import authService from "../services/authService";
export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.forgotPassword(email);
      console.log(response);
      setMessage("Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.");
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
          Quên mật khẩu
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Gửi
        </button>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
};
