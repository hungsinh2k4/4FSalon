import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Barber Hair Cutting Effect 3.png";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Xử lý đăng xuất
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  console.log(user);

  return (
    <nav className="bg-white p-4 sticky top-0 left-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between ">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-black text-2xl">4F Salon</h1>
        </div>

        <div className="hidden md:flex items-center">
          <Link to="/" className="nav-items">
            Trang Chủ
          </Link>
          <Link to="/about-us" className="nav-items">
            Về chúng tôi
          </Link>
          <a href="https://zalo.me/g/brxjir719" className="nav-items">
            Liên hệ
          </a>
          <Link to="/find-nearest-shop" className="nav-items">
            Tìm chi nhánh
          </Link>
          <Link to="/booking" className="nav-items">
            Đặt lịch Hẹn
          </Link>
          {user ? (
            <div className="relative">
              <div
                className="flex items-center space-x-4 mx-4 cursor-pointer border rounded-full p-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={user.avatar || "kannastare.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </div>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    Xem thông tin
                  </Link>
                  <Link
                    to="/lichhen"
                    className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    Lịch hẹn
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-black text-white px-3 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200 mx-4"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Button để mở/đóng menu trên màn hình nhỏ */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-black"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col space-y-2">
          <Link to="/" className="mobile-nav-items">
            Trang Chủ
          </Link>
          <Link to="/aboutUs" className="mobile-nav-items">
            Về chúng tôi
          </Link>
          <a href="https://zalo.me/g/brxjir719" className="mobile-nav-items">
            Liên hệ
          </a>
          <Link to="/findNearestShop" className="mobile-nav-items">
            Tìm chi nhánh
          </Link>
          <Link to="/booking" className="mobile-nav-items">
            Đặt lịch Hẹn
          </Link>
          <Link
            to="/login"
            className="bg-black text-white px-3 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200"
          >
            Đăng Nhập
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
