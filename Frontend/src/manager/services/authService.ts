// src/manager/services/AuthService.ts
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

interface LoginResponse {
  access_token: string;
}
class AuthService {
  private static instance: AuthService;
  private token: string | null = localStorage.getItem('token');

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
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Authorization', `Bearer ${token}`);
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
  
  public async login(username: string, password: string): Promise<void> {
    try {
      //console.log({ email: username, password: password });

      //const response = await axios.post<LoginResponse>('/auth/login-admin', { email: "string@", password: password });

      console.log("login");
      const response = await axiosInstance.post<LoginResponse>('/auth/login', { email: username, password: password });
      console.log('Loginsd successfully');
      console.log('Login successfully');
      this.token = response.data.access_token;
      if (this.token) {
        localStorage.setItem('token', this.token);
      }
      console.log('tokeqwen', this.token);
      this.setAxiosAuthToken(this.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  public async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout failed:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('token');
      this.setAxiosAuthToken(this.token);
      window.location.href = '/manager/login';
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
