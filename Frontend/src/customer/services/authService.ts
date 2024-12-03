// src/manager/services/AuthService.ts
import axiosInstance from "../api/axiosInstance";
import { User } from "../utils/types";
import { getUser, updateUser } from "../api/user";

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

  public async updateProfile(userData: any): Promise<void> {
    try {
      await axiosInstance.patch(`/api/users/profile`, userData);
      const user = await updateUser(userData);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error: any) {
      console.error(
        "Update user failed:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await axiosInstance.post(`/auth/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error: any) {
      console.error("Change password failed:", error);
      throw error;
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      await axiosInstance.post(`/auth/forgot-password`, { email });
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
