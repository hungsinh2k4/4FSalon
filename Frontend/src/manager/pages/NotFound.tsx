// src/manager/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFound}>
      <h2>404 - Trang không tìm thấy</h2>
      <Link to="/manager/dashboard">Quay lại Bảng điều khiển</Link>
    </div>
  );
};

export default NotFound;
