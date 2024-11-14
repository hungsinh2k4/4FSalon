// src/manager/services/AuthService.ts
import axiosInstance from "../api/axiosInstance";
import { User } from "../utils/types";
import { getUser } from "../api/user";

interface LoginResponse {
  access_token: string;
  user: User;
}
class AuthService {
  private static instance: AuthService;
  private token: string | null = sessionStorage.getItem("token");

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
      return { access_token: this.token, user: user }; // Giả sử user[0] là người dùng hiện tại
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  }

  public async loginWithGoogle(
    tokenId: string
  ): Promise<{ access_token: string; user: User }> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/google", {
        tokenId,
      });
      this.token = response.data.access_token;
      localStorage.setItem("token", this.token);
      this.setAxiosAuthToken(this.token);

      // Lấy thông tin người dùng từ Google sau khi đăng nhập thành công
      const user = response.data.user;
      return { access_token: this.token, user: user };
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
}

const authService = AuthService.getInstance();
export default authService;
