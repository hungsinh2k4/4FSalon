// src/manager/components/Header/Header.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={styles.header}>
      <h1>Quản Lý</h1>
      <Button onClick={handleLogout}>Đăng xuất</Button>
    </header>
  );
};

export default Header;
