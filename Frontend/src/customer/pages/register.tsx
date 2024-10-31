import React from "react";
import logo from "../assets/Barber Hair Cutting Effect 3.png";
import gglogo from "../assets/Login/icons8-google-48.png";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="text"
              id="Name"
              placeholder="Nhập tên đăng ký"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              id="email"
              placeholder="Nhập email đăng ký"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              id="phonenumber"
              placeholder="Nhập số điện thoại"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div className="text-right">
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Đăng Ký
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-full border-t"></span>
          <span className="text-sm mx-2">hoặc</span>
          <span className="w-full border-t"></span>
        </div>

        <button className="mt-4 flex items-center justify-center w-full border py-2 rounded-lg bg-white shadow-md hover:bg-gray-100">
          <img
            src={gglogo}
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Đăng ký với tài khoản Google
        </button>

        <p className="text-center mt-4 text-sm">
          Đã có tài khoản?{" "}
          <Link to = "/login" className="nav-items">
          Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
