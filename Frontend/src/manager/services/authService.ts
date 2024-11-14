// src/manager/services/AuthService.ts
import axiosInstance from '../api/axiosInstance';

interface LoginResponse {
  access_token: string;
}
class AuthService {
  private static instance: AuthService;
  private token: string | null = sessionStorage.getItem('token');

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
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
      console.log('Set token', `Bearer ${token}`);
    } else {
      delete axiosInstance.defaults.headers['Authorization'];
    }
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }
  
  public async login(username: string, password: string): Promise<void> {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login-admin', { email: username, password: password });
      this.token = response.data.access_token;
      sessionStorage.setItem('token', this.token);
      this.setAxiosAuthToken(this.token);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  public async logout(): Promise<void> {
    try {
      window.location.href = '/manager/login';
      await axiosInstance.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout failed:', error);
    } finally {
      this.token = null;
      sessionStorage.removeItem('token');
      this.setAxiosAuthToken(this.token);
    }
  }
}

const authService = AuthService.getInstance();
export default authService;
