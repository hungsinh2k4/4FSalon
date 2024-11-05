// src/manager/components/forms/LoginForm.tsx
import React, { useState } from 'react';


import AuthService from '../../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './LoginForm.module.css';
import axios from 'axios';



const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy vị trí người dùng đang cố gắng truy cập trước khi bị chuyển hướng đến đăng nhập
  const from = (location.state as any)?.from?.pathname || '/manager/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AuthService.login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h2>Đăng nhập 4F MANAGER</h2>
      {error && <p className={styles.error}>{error}</p>}
      <Input
        label="Email"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
};

export default LoginForm;
