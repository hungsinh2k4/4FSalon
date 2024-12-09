import React from "react";
import logo from "../assets/Barber Hair Cutting Effect 3.png";
import gglogo from "../assets/Login/icons8-google-48.png";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

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
    setUser(user);
    console.log("Logged in with Google successfully");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Registering...");
      console.log("name:", name);
      console.log("email:", email);
      console.log("password...", password);
      console.log("phoneNumber...", phoneNumber);
      const response = await authService.register(
        name,
        email,
        password,
        phoneNumber
      );
      toast.success("Đăng ký thành công");
      console.log("Register success:", response);
      navigate("/login");
    } catch (error: any) {
      toast.error("Đăng ký thất bại");
      console.error("Register failed:", error);
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              id="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên đăng ký"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email đăng ký"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              id="phonenumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại"
              className="mt-1 p-2 w-full border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>
          <div className="text-right"></div>
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

        <button
          onClick={handleGoogleLogin}
          className="mt-4 flex items-center justify-center w-full border py-2 rounded-lg bg-white shadow-md hover:bg-gray-100"
        >
          <img src={gglogo} alt="Google" className="w-5 h-5 mr-2" />
          Đăng ký với tài khoản Google
        </button>

        <p className="text-center mt-4 text-sm">
          Đã có tài khoản?{" "}
          <Link to="/login" className="nav-items">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
