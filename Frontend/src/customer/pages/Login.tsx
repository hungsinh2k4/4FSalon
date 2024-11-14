import React, { useState } from "react";
import logo from "../assets/Barber Hair Cutting Effect 3.png";
import gglogo from "../assets/Login/icons8-google-48.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { User } from "../utils/types";
import { GoogleLogin } from "react-google-login";

const Login: React.FC = () => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(loginIdentifier, password);
      const { access_token, user } = response;
      // console.log(response);
      sessionStorage.setItem("token", access_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      // setUser({
      //   username: user.name,
      //   avatar: user.avatar || "", // Ensure avatar is a string
      // });
      setUser(user);
      navigate("/"); // Chuyển hướng đến trang chủ hoặc trang khác khi đăng nhập thành công
    } catch (error: any) {
      setError(error.message); // Cập nhật lỗi để hiển thị nếu đăng nhập thất bại
      console.error("Login failed:", error);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const googleResponse = await authService.loginWithGoogle();
  //     const { access_token, user } = googleResponse;
  //     sessionStorage.setItem("token", access_token);
  //     sessionStorage.setItem("user", JSON.stringify(user));
  //     setUser(user);
  //     navigate("/"); // Chuyển hướng đến trang chủ hoặc trang khác khi đăng nhập thành công
  //   } catch (error: any) {
  //     setError(error.message); // Cập nhật lỗi để hiển thị nếu đăng nhập thất bại
  //     console.error("Google login failed:", error);
  //   }
  // };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const user = await authService.loginWithGoogle();
  //     const { name, email } = user;

  //     // Lưu thông tin người dùng vào sessionStorage
  //     sessionStorage.setItem("userName", name || ""); // Thêm kiểm tra null cho name
  //     sessionStorage.setItem("userEmail", email || ""); // Thêm kiểm tra null cho email

  //     setUser(user); // Cập nhật trạng thái người dùng với tên và email
  //     navigate("/"); // Chuyển hướng đến trang chủ hoặc trang khác khi đăng nhập thành công
  //   } catch (error: any) {
  //     setError(error.message); // Cập nhật lỗi để hiển thị nếu đăng nhập thất bại
  //     console.error("Google login failed:", error);
  //   }
  // };

  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      const { tokenId } = response;
      const googleResponse = await authService.loginWithGoogle(tokenId);
      const { access_token, user } = googleResponse;
      sessionStorage.setItem("token", access_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/"); // Chuyển hướng đến trang chủ hoặc trang khác khi đăng nhập thành công
    } catch (error: any) {
      setError(error.message); // Cập nhật lỗi để hiển thị nếu đăng nhập thất bại
      console.error("Google login failed:", error);
    }
  };
  const handleGoogleLoginFailure = (response: any) => {
    setError("Đăng nhập bằng Google thất bại");
    console.error("Google login failed:", response);
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
            <a href="#" className="text-sm text-blue-600 hover:underline">
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
        <GoogleLogin
          clientId="690638096410-1jk9fil7m1mjfde7781baju4oadbha8k.apps.googleusercontent.com"
          buttonText="Đăng nhập với tài khoản Google"
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              className="mt-4 flex items-center justify-center w-full border py-2 rounded-lg bg-white shadow-md hover:bg-gray-100"
            >
              <img src={gglogo} alt="Google" className="w-5 h-5 mr-2" />
              Đăng nhập với tài khoản Google
            </button>
          )}
        />
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
