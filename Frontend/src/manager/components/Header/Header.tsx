// src/manager/components/Header/Header.tsx
import React from 'react';
import AuthService from '../../services/authService';
import Button from '../common/Button';
import styles from './Header.module.css';
import logo from '../../assets/images/manager_logo.png';
const Header: React.FC = () => {

 
  return (
    <header className={styles.header}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <Button variant="primary" width='150px' onClick={() => AuthService.logout()}>Đăng xuất</Button>
    </header>
  );
};

export default Header;
