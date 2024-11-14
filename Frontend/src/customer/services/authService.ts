// src/manager/services/AuthService.ts
import axiosInstance from "../api/axiosInstance";
import { User } from "../utils/types";
import { getUser } from "../api/user";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

interface LoginResponse {
  access_token: string;
  user: User;
}

const firebaseConfig = {
  apiKey: "AIzaSyCLIs1Y8b99N3P-R2IyuP9P0rZFxxLMaTo",
  authDomain: "f-salon-test.firebaseapp.com",
  projectId: "f-salon-test",
  storageBucket: "f-salon-test.firebasestorage.app",
  messagingSenderId: "1035744192541",
  appId: "1:1035744192541:web:a6790e3839f3f08dac7ef4",
  measurementId: "G-CCXT4GN0WD",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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

  private setAxiosAuthToken(token: string | null) {
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
      sessionStorage.setItem("token", this.token);
      this.setAxiosAuthToken(this.token);

      // Lấy thông tin người dùng sau khi đăng nhập thành công
      const user = await getUser();
      return { access_token: this.token, user: user }; // Giả sử user[0] là người dùng hiện tại
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  }

  // public async loginWithGoogle(): Promise<{
  //   access_token: string;
  //   user: User;
  // }> {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential?.accessToken;
  //     const user = result.user.email;

  //     // Gửi token đến backend để lấy thông tin người dùng và token
  //     const response = await axiosInstance.post<LoginResponse>("/auth/google", {
  //       token,
  //     });
  //     this.token = response.data.access_token;
  //     sessionStorage.setItem("token", this.token);
  //     this.setAxiosAuthToken(this.token);

  //     return { access_token: this.token, user: response.data.user };
  //   } catch (error: any) {
  //     throw new Error(
  //       error.response?.data?.message || "Đăng nhập bằng Google thất bại"
  //     );
  //   }
  // }

  // public async loginWithGoogle(): Promise<{
  //   email: string;
  //   name: string | null;
  // }> {
  //   try {
  //     // Sử dụng signInWithPopup để đăng nhập
  //     const result = await signInWithPopup(auth, googleProvider);

  //     // Lấy thông tin người dùng từ kết quả
  //     const user = result.user;
  //     const email = user.email; // Lấy email người dùng
  //     const name = user.displayName; // Lấy tên người dùng

  //     // Trả về email và tên của người dùng
  //     return { email: email || "", name: name || "" };
  //   } catch (error: any) {
  //     console.error("Đăng nhập bằng Google thất bại", error);
  //     throw new Error("Đăng nhập bằng Google thất bại");
  //   }
  // }

  // public async loginWithGoogle(): Promise<User> {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const googleUser = result.user;

  //     const user: User = {
  //       name: googleUser.displayName || "No Name",
  //       email: googleUser.email || "No Email",
  //       phone: "",
  //       point: new Int16Array([0]),
  //       avatar: googleUser.photoURL || "",
  //       isGoogleAccount: true,
  //     };

  //     return user;
  //   } catch (error) {
  //     console.error("Google login failed:", error);
  //     throw new Error("Google login failed");
  //   }
  // }

  public async loginWithGoogle(
    tokenId: string
  ): Promise<{ access_token: string; user: User }> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/google", {
        tokenId,
      });
      this.token = response.data.access_token;
      sessionStorage.setItem("token", this.token);
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
      sessionStorage.removeItem("token");
      this.setAxiosAuthToken(this.token);
      window.location.href = "/login";
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
