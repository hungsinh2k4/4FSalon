// src/manager/pages/Login/ManagerLogin.tsx
import React from 'react';
import LoginForm from '../../components/forms/LoginForm';
import styles from './ManagerLogin.module.css';

const ManagerLogin: React.FC = () => {
  
  return (
    <div className={styles.loginContainer}>
      <LoginForm />
    </div>
  );
};

export default ManagerLogin;
