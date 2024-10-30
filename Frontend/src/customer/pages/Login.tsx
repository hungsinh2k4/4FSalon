import React from "react";
import logo from "../assets/Barber Hair Cutting Effect 3.png";

const Login: React.FC = () => {
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="email"
              placeholder="Email hoặc số điện thoại"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu ?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-full border-t"></span>
          <span className="text-sm mx-2">hoặc</span>
          <span className="w-full border-t"></span>
        </div>

        <button className="mt-4 flex items-center justify-center w-full border py-2 rounded-lg bg-white shadow-md hover:bg-gray-100">
          <img
            src="path-to-google-icon.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Đăng nhập với tài khoản Google
        </button>

        <p className="text-center mt-4 text-sm">
          Không có tài khoản?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
