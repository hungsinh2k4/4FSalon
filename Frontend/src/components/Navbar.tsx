import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/src/assets/Barber Hair Cutting Effect 3.png";
import "/src/styles/Navbar.css";
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white p-4 sticky top-0 left-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between ">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-black text-2xl">4F Salon</h1>
        </div>

        <div className="hidden md:flex items-center ">
          <Link to="/" className="nav-items">
            Trang Chủ
          </Link>
          <Link to="/aboutUs" className="nav-items">
            Về chúng tôi
          </Link>
          <Link to="/contact" className="nav-items">
            Liên hệ
          </Link>
          <Link to="/findNearestShop" className="nav-items">
            Tìm chi nhánh
          </Link>
          <Link to="/booking" className="nav-items">
            Đặt lịch Hẹn
          </Link>
          <Link
            to="/login"
            className="bg-black ml-16 py-1  text-white px-3 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200"
          >
            Đăng Nhập
          </Link>
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
          <Link
            to="/"
            className="block text-black hover:text-gray-600 transition-colors duration-200"
          >
            Trang Chủ
          </Link>
          <Link
            to="/aboutUs"
            className="block text-black hover:text-gray-600 transition-colors duration-200"
          >
            Về chúng tôi
          </Link>
          <Link
            to="/contacts"
            className="block text-black hover:text-gray-600 transition-colors duration-200"
          >
            Liên hệ
          </Link>
          <Link
            to="/findNearestShop"
            className="block text-black hover:text-gray-600 transition-colors duration-200"
          >
            Tìm chi nhánh
          </Link>
          <Link
            to="/booking"
            className="block text-black hover:text-gray-600 transition-colors duration-200"
          >
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
