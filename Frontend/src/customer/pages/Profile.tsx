import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    // Xử lý lưu dữ liệu thay đổi lên server
    if (selectedFile) {
      // Thực hiện upload file lên server
    }
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Thông tin tài khoản</h1> */}
      <div className="mt-6 flex space-x-4 mx-4 mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Home /
        </Link>
        <Link to="/profile" className="text-blue-600 hover:underline">
          Profile /
        </Link>
        <Link to="/change-password" className="text-blue-600 hover:underline">
          Change Password
        </Link>
      </div>
      <div className="bg-white p-6 border-neutral-950 rounded-3xl border shadow-md">
        <h2 className="text-xl font-bold mb-4 border-black  pb-2">
          Thông tin tài khoản
        </h2>
        <div className="flex items-center mb-6">
          <div className="w-1/2 mr-4">
            <label className="block text-lg font-semibold rounded-full">
              Tên:
            </label>
            <input
              type="text"
              defaultValue={user.name}
              className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />

            <label className="block text-lg font-semibold">Email:</label>
            <input
              type="email"
              defaultValue={user.email}
              className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />

            <label className="block text-lg font-semibold">
              Số điện thoại:
            </label>
            <input
              type="tel"
              defaultValue={user.phone}
              className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isEditing}
            />

            <div className="flex items-center">
              <label className="mr-2 font-semibold">Giới tính:</label>
              <input
                type="radio"
                name="gender"
                value="male"
                disabled={!isEditing}
                className="mr-1"
              />{" "}
              Nam
              <input
                type="radio"
                name="gender"
                value="female"
                disabled={!isEditing}
                className="mx-2"
              />{" "}
              Nữ
              <input
                type="radio"
                name="gender"
                value="other"
                disabled={!isEditing}
                className="mx-2"
              />{" "}
              Bí mật
            </div>
          </div>

          <div className="w-1/2 flex flex-col items-center">
            <div className="relative">
              <img
                src={avatarPreview || ""}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border border-gray-300 mb-4"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>
            <button className="px-3 py-1 bg-gray-200 rounded-md mt-2 text-sm">
              Chọn tệp
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
