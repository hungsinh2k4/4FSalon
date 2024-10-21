import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '/src/assets/Barber Hair Cutting Effect 3.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white p-4 w-screen sticky top-0 left-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-black text-2xl">4F Salon</h1>
        </div>
        
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="text-black hover:text-gray-600 transition-colors duration-200">Trang Chủ</Link>
          <Link to="/vechungtoi" className="text-black hover:text-gray-600 transition-colors duration-200">Về chúng tôi</Link>
          <Link to="/lienhe" className="text-black hover:text-gray-600 transition-colors duration-200">Liên hệ</Link>
          <Link to="/timchinhanh" className="text-black hover:text-gray-600 transition-colors duration-200">Tìm chi nhánh</Link>
          <Link to="/datlichhen" className="text-black hover:text-gray-600 transition-colors duration-200">Đặt lịch Hẹn</Link>
          <Link to="/login" className="bg-black text-white px-3 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200">Đăng Nhập</Link>
        </div>

        {/* Button để mở/đóng menu trên màn hình nhỏ */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-black">
          {isOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-2">
          <Link to="/" className="block text-black hover:text-gray-600 transition-colors duration-200">Trang Chủ</Link>
          <Link to="/vechungtoi" className="block text-black hover:text-gray-600 transition-colors duration-200">Về chúng tôi</Link>
          <Link to="/lienhe" className="block text-black hover:text-gray-600 transition-colors duration-200">Liên hệ</Link>
          <Link to="/timchinhanh" className="block text-black hover:text-gray-600 transition-colors duration-200">Tìm chi nhánh</Link>
          <Link to="/datlichhen" className="block text-black hover:text-gray-600 transition-colors duration-200">Đặt lịch Hẹn</Link>
          <Link to="/login" className="bg-black text-white px-3 rounded-full hover:bg-gray-600 hover:text-white transition-colors duration-200">Đăng Nhập</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
