// src/manager/services/AuthService.ts
import axiosInstance from "../api/axiosInstance";
import { User } from "../utils/types";
import { getUser, updateUser } from "../api/user";
import { set } from "rsuite/esm/internals/utils/date";
import { useAuth } from "../context/AuthContext";

interface LoginResponse {
  access_token: string;
  user: User;
}
class AuthService {
  private static instance: AuthService;
  private token: string | null = localStorage.getItem("token");

  private constructor() {
    this.setAxiosAuthToken(this.token);
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public setAxiosAuthToken(token: string | null) {
    if (token) {
      axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
      console.log("Set token", `Bearer ${token}`);
    } else {
      delete axiosInstance.defaults.headers["Authorization"];
    }
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public async login(
    loginIdentifier: string,
    password: string
  ): Promise<{ access_token: string; user: User }> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email: loginIdentifier,
        password,
      });
      this.token = response.data.access_token;
      localStorage.setItem("token", this.token);
      this.setAxiosAuthToken(this.token);

      // Lấy thông tin người dùng sau khi đăng nhập thành công
      const user = await getUser();
      localStorage.setItem("user", JSON.stringify(user));
      return { access_token: this.token, user: user }; // Giả sử user[0] là người dùng hiện tại
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  }

  public async loginWithGoogle(token: string): Promise<{ user: User }> {
    try {
      this.token = token;
      localStorage.setItem("token", this.token);
      const user = await getUser();
      localStorage.setItem("user", JSON.stringify(user));
      return { user: user };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Đăng nhập bằng Google thất bại"
      );
    }
  }

  public async logout(): Promise<void> {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error: any) {
      console.error("Logout failed:", error);
    } finally {
      this.token = null;
      localStorage.removeItem("token");
      this.setAxiosAuthToken(this.token);
      window.location.href = "/login";
    }
  }

  public async register(
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<{ user: User }> {
    try {
      const response = await axiosInstance.post<{ user: User }>(
        "/auth/register",
        {
          name,
          email,
          password,
          phone,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  }

  public async updateProfile(
    name: string,
    phone: string,
    gender: string
  ): Promise<{ user: User }> {
    try {
      const response = await axiosInstance.patch<{ user: User }>(
        "/api/users/profile",
        {
          name,
          phone,
          gender,
        }
      );
      return response.data;
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Cập nhật thất bại");
    }
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<string> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }
      await axiosInstance.post(
        `/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return "Mật khẩu đã được thay đổi thành công.";
    } catch (error: any) {
      console.error("Change password failed:", error);
      throw error;
    }
  }

  public async forgotPassword(email: string): Promise<string> {
    try {
      await axiosInstance.post(`/auth/forgot-password`, { email });
      return "Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.";
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<string> {
    try {
      console.log("token", token);
      await axiosInstance.patch(`/auth/reset-password`, {
        token,
        newPassword,
      });
      return "Mật khẩu đã được đặt lại thành công.";
    } catch (error: any) {
      console.log("token", token);
      console.error("Reset password failed:", error);
      throw new Error(
        error.response?.data?.message || "Không thể đặt lại mật khẩu."
      );
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
