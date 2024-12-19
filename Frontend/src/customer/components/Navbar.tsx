import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? "nav-items text-blue-400 border-b-2 border-blue-200"
      : "nav-items";
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white p-4 sticky top-0 left-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="logo2.png" alt="Logo" className="h-10 w-10" />
          <h1 className="text-black text-2xl">4F Salon</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <Link to="/" className={getLinkClass("/")}>
            Trang Chủ
          </Link>
          <Link to="/about-us" className={getLinkClass("/about-us")}>
            Về chúng tôi
          </Link>
          <a
            href="https://zalo.me/g/brxjir719"
            className="nav-items"
            target="_blank"
            rel="noopener noreferrer"
          >
            Liên hệ
          </a>
          <Link
            to="/find-nearest-shop"
            className={getLinkClass("/find-nearest-shop")}
          >
            Tìm chi nhánh
          </Link>
          <Link to="/booking" className={getLinkClass("/booking")}>
            Đặt lịch Hẹn
          </Link>
          {user ? (
            <div className="relative">
              <div
                className="flex items-center space-x-4 mx-4 cursor-pointer border rounded-full p-1"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={user.avatar_url}
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
                    to="/appointment"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-1/6 md:hidden text-black text-xl"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}>
        <div className="flex flex-col space-y-2">
          <Link to="/" className="mobile-nav-items" onClick={handleLinkClick}>
            Trang Chủ
          </Link>
          <Link
            to="/about-us"
            className="mobile-nav-items"
            onClick={handleLinkClick}
          >
            Về chúng tôi
          </Link>
          <a
            href="https://zalo.me/g/brxjir719"
            className="mobile-nav-items"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
          >
            Liên hệ
          </a>
          <Link
            to="/find-nearest-shop"
            className="mobile-nav-items"
            onClick={handleLinkClick}
          >
            Tìm chi nhánh
          </Link>
          <Link
            to="/booking"
            className="mobile-nav-items"
            onClick={handleLinkClick}
          >
            Đặt lịch Hẹn
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="mobile-nav-items"
                onClick={handleLinkClick}
              >
                Xem thông tin
              </Link>
              <Link
                to="/appointment"
                className="mobile-nav-items"
                onClick={handleLinkClick}
              >
                Lịch hẹn
              </Link>
              <button
                onClick={handleLogout}
                className="text-left mobile-nav-items"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-black text-white px-3 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200 mobile-nav-items"
              onClick={handleLinkClick}
            >
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
