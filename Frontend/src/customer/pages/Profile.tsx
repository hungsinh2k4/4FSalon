// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import authService from "../services/authService";
// // import { updateUser } from "../api/user";
// import { User } from "../utils/types"; // Đảm bảo bạn đã import đúng
// import { useLocation } from "react-router-dom";

// const Profile: React.FC = () => {
//   const { user, setUser } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempUser, setTempUser] = useState<User | null>(user);
//   const location = useLocation();

//   const getLinkClass = (path: string) => {
//     return location.pathname === path
//       ? "nav-items text-blue-400 border-b-2 border-blue-200"
//       : "text-gray-600 hover:text-blue-400 hover:border-b-2 hover:border-blue-200";
//   };

//   useEffect(() => {
//     if (user) {
//       setTempUser(user);
//     }
//   }, [user]);

//   if (!tempUser) {
//     return <div>Loading...</div>;
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (tempUser) {
//       setTempUser({
//         ...tempUser,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };

//   const handleSaveChanges = async () => {
//     if (tempUser) {
//       try {
//         console.log("update user........");
//         console.log("user", tempUser);
//         const response = await authService.updateProfile(
//           tempUser.name,
//           tempUser.phone,
//           tempUser.gender
//         );
//         console.log("response", response);
//         setUser(tempUser);
//         setIsEditing(false);
//       } catch (error) {
//         console.error("Update user failed:", error);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <div className="mt-6 flex space-x-4 mx-4 mb-4">
//         <Link
//           to="/"
//           className={getLinkClass("/")}
//           // className="text-gray-600 hover:text-blue-400 hover:underline"
//         >
//           Home
//         </Link>
//         <p>/</p>
//         <Link
//           to="/profile"
//           className={getLinkClass("/profile")}
//           // className="text-gray-600 hover:text-blue-400 hover:underline"
//         >
//           Profile
//         </Link>
//         <p>/</p>
//         <Link
//           to="/change-password"
//           className={getLinkClass("/change-password")}
//         >
//           Change Password
//         </Link>
//       </div>
//       <div className="bg-white p-6 border-neutral-950 rounded-3xl border shadow-md">
//         <h2 className="text-xl font-bold mb-4 border-black pb-2">
//           Thông tin tài khoản
//         </h2>
//         <div className="flex items-center mb-6">
//           <div className="w-full mr-4">
//             <label className="block text-lg font-semibold rounded-full">
//               Tên:
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={tempUser?.name || ""}
//               onChange={handleInputChange}
//               className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={!isEditing}
//             />

//             <label className="block text-lg font-semibold">Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={tempUser?.email || ""}
//               className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//               disabled
//             />

//             <label className="block text-lg font-semibold">
//               Số điện thoại:
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={tempUser?.phone || ""}
//               onChange={handleInputChange}
//               className="border rounded-md w-full py-2 px-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={!isEditing}
//             />

//             <div className="flex items-center">
//               <label className="mr-2 font-semibold">Giới tính:</label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="male"
//                 checked={tempUser?.gender === "male"}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className="mr-1"
//               />{" "}
//               Nam
//               <input
//                 type="radio"
//                 name="gender"
//                 value="female"
//                 checked={tempUser?.gender === "female"}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className="mx-2"
//               />{" "}
//               Nữ
//               <input
//                 type="radio"
//                 name="gender"
//                 value="other"
//                 checked={tempUser?.gender === "other"}
//                 onChange={handleInputChange}
//                 disabled={!isEditing}
//                 className="mx-2"
//               />{" "}
//               Bí mật
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-4">
//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className="bg-gray-800 text-white py-2 px-4 rounded-lg w-1/6"
//           >
//             {isEditing ? "Hủy" : "Chỉnh sửa"}
//           </button>
//           {isEditing && (
//             <button
//               onClick={handleSaveChanges}
//               className="bg-blue-600 text-white py-2 px-4 rounded-lg w-1/6"
//             >
//               Lưu thay đổi
//             </button>
//           )}
//           <Link
//             to={"/change-password"}
//             className="text-center bg-blue-600 text-white py-2 px-4 rounded-lg w-1/6"
//           >
//             Đổi mật khẩu
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import { User } from "../utils/types";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";

// import Breadcrumb from "../components/Breadcrumb";

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(user);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Sử dụng hook useNavigate

  useEffect(() => {
    if (user) {
      console.log("user", user);
      setTempUser(user);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tempUser) {
      setTempUser({
        ...tempUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tempUser) {
      setTempUser({
        ...tempUser,
        gender: e.target.value as "male" | "female" | "other",
      });
    }
  };

  const handleSaveChanges = async () => {
    if (tempUser) {
      setLoading(true);
      try {
        await authService.updateProfile(
          tempUser.name,
          tempUser.phone,
          tempUser.gender
        );
        setUser(tempUser);
        toast.success("Cập nhật thông tin thành công");
        console.log("update user........", tempUser);
        setIsEditing(false);
      } catch (error) {
        toast.error("Cập nhật thông tin thất bại");
        console.error("Update user failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelChanges = () => {
    setTempUser(user);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // Điều hướng đến trang đổi mật khẩu
  };

  if (!tempUser) {
    return <p>Loading user data...</p>;
  }

  return (
    <div
      className={`block items-center overflow-hidden bg-gray-50 py-6 sm:py-12 `}
    >
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 border">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Thông tin</h1>
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              name="name"
              value={tempUser.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-1 px-4 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số Điện Thoại
            </label>
            <input
              type="text"
              name="phone"
              value={tempUser.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-1 px-4 py-2 border ${
                isEditing ? "border-gray-300" : "border-transparent"
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giới Tính
            </label>
            <div className="flex items-center mt-2 space-x-4">
              {["male", "female", "other"].map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={tempUser.gender === gender}
                    onChange={handleGenderChange}
                    disabled={!isEditing}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 capitalize">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={tempUser.email}
              disabled
              className="w-full mt-1 px-4 py-2 border border-transparent rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          {/* Booking Count (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số Lần Đặt
            </label>
            <input
              type="number"
              name="bookingCount"
              value={tempUser.booking_count || 0}
              disabled
              className="w-full mt-1 px-4 py-2 border border-transparent rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          {/* Cancel Count (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số Lần Hủy
            </label>
            <input
              type="number"
              name="cancelCount"
              value={tempUser.cancel_count || 0}
              disabled
              className="w-full mt-1 px-4 py-2 border border-transparent rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          {/* Points (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Points
            </label>
            <input
              type="number"
              name="points"
              value={tempUser.points}
              disabled
              className="w-full mt-1 px-4 py-2 border border-transparent rounded-md bg-gray-100 text-gray-600"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelChanges}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Chỉnh Sửa
              </button>
            )}
            <button
              onClick={handleChangePassword}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Thay đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
