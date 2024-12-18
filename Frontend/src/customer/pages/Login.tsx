import React, { useState, useEffect } from "react";
import logo from "../assets/Barber Hair Cutting Effect 3.png";
import gglogo from "../assets/Login/icons8-google-48.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(loginIdentifier, password);
      const { user: loggedInUser } = response;
      setUser(loggedInUser);
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error: any) {
      toast.error("Đăng nhập thất bại");
      setError(error.message); // Cập nhật lỗi để hiển thị nếu đăng nhập thất bại
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("handleGoogleLogin");
    const oauthWindow = await window.open(
      `${API_BASE_URL}/auth/google`,
      "",
      "width=500,height=600"
    );

    window.addEventListener("message", (event) => {
      if (event.origin !== API_BASE_URL) {
        console.log("Invalid origin", event.origin);
        return;
      }

      const { access_token } = event.data;
      console.log("access_token", access_token);
      if (access_token) {
        console.log("access_token", access_token);
        handleToken(access_token);
      }
    });
  };

  const handleToken = async (access_token: string) => {
    const { user } = await authService.loginWithGoogle(access_token);
    toast.success("Đăng nhập thành công");
    setUser(user);
    console.log("Logged in with Google successfully");
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="loginIdentifier"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="Email, số điện thoại hoặc tên đăng nhập"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu ?
            </a>
          </div>
          {/* Hiển thị lỗi nếu có */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
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
        <button
          onClick={handleGoogleLogin}
          className="mt-4 flex items-center justify-center w-full border py-2 rounded-lg bg-white shadow-md hover:bg-gray-100"
        >
          <img src={gglogo} alt="Google" className="w-5 h-5 mr-2" />
          Đăng nhập với tài khoản Google
        </button>
        <p className="text-center mt-4 text-sm">
          Không có tài khoản?{" "}
          <Link to="/register" className="nav-items">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
