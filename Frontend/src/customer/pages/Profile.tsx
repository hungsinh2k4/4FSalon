import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { User } from "../utils/types"; // Đảm bảo bạn đã import đúng

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(user);

  useEffect(() => {
    if (user) {
      setTempUser(user);
    }
  }, [user]);

  if (!tempUser) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tempUser) {
      setTempUser({
        ...tempUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (tempUser) {
      try {
        console.log("update user........");
        console.log("user", tempUser);
        await authService.updateProfile(tempUser);
        setUser(tempUser);
        setIsEditing(false);
      } catch (error) {
        console.error("Update user failed:", error);
        alert("Có lỗi xảy ra khi lưu thông tin tài khoản");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-6 flex space-x-4 mx-4 mb-4">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-400 hover:underline"
        >
          Home
        </Link>
        <p>/</p>
        <Link
          to="/profile"
          className="text-gray-600 hover:text-blue-400 hover:underline"
        >
          Profile
        </Link>
        <p>/</p>
        <Link
          to="/change-password"
          className="text-gray-600 hover:text-blue-400 hover:underline"
        >
          Change Password
        </Link>
      </div>
      <div className="bg-white p-6 border-neutral-950 rounded-3xl border shadow-md">
        <h2 className="text-xl font-bold mb-4 border-black pb-2">
          Thông tin tài khoản
        </h2>
        <div className="flex items-center mb-6">
          <div className="w-full mr-4">
            <label className="block text-lg font-semibold rounded-full">
              Tên:
            </label>
            <input
              type="text"
              name="name"
              value={tempUser?.name || ""}
              onChange={handleInputChange}
              className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />

            <label className="block text-lg font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={tempUser?.email || ""}
              onChange={handleInputChange}
              className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />

            <label className="block text-lg font-semibold">
              Số điện thoại:
            </label>
            <input
              type="tel"
              name="phone"
              value={tempUser?.phone || ""}
              onChange={handleInputChange}
              className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />

            <div className="flex items-center">
              <label className="mr-2 font-semibold">Giới tính:</label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={tempUser?.gender === "male"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mr-1"
              />{" "}
              Nam
              <input
                type="radio"
                name="gender"
                value="female"
                checked={tempUser?.gender === "female"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mx-2"
              />{" "}
              Nữ
              <input
                type="radio"
                name="gender"
                value="other"
                checked={tempUser?.gender === "other"}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mx-2"
              />{" "}
              Bí mật
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-800 text-white py-2 px-4 rounded-lg w-1/6"
          >
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
          {isEditing && (
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg w-1/6"
            >
              Lưu thay đổi
            </button>
          )}
          <Link
            to={"/change-password"}
            className="text-center bg-blue-600 text-white py-2 px-4 rounded-lg w-1/6"
          >
            Đổi mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
