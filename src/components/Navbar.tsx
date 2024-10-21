import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white p-4 w-screen fixed top-0 left-0 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
          <img src='/src/assets/Barber Hair Cutting Effect 3.png' alt="Logo" className="h-10 w-10" />
          <h1 className="text-black text-2xl">4F Salon</h1>
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="text-black hover:text-gray-600">Trang Chủ</Link>
          <Link to="/vechungtoi" className="text-black hover:text-gray-600">Về chúng tôi</Link>
          <Link to="/lienhe" className="text-black hover:text-gray-600">Liên hệ</Link>
          <Link to="/timchinhanh" className="text-black hover:text-gray-600">Tìm chi nhánh</Link>
          <Link to="/datlichhen" className="text-black hover:text-gray-600">Đặt lịch Hẹn</Link>
          <Link to="/login" className="bg-black text-white px-3 rounded-full hover:bg-gray-600 hover:text-white">Đăng Nhập</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;