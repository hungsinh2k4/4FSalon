// src/manager/components/Sidebar/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Quản Lý</h2>
      <nav className={styles.nav}>
        <NavLink to="/manager/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/manager/accounts" className={({ isActive }) => isActive ? styles.active : ''}>
          Tài Khoản
        </NavLink>
        <NavLink to="/manager/feedbacks" className={({ isActive }) => isActive ? styles.active : ''}>
          Phản Hồi
        </NavLink>
        <NavLink to="/manager/services" className={({ isActive }) => isActive ? styles.active : ''}>
          Dịch Vụ
        </NavLink>
        <NavLink to="/manager/schedules" className={({ isActive }) => isActive ? styles.active : ''}>
          Lịch Làm Việc
        </NavLink>
        <NavLink to="/manager/appointments" className={({ isActive }) => isActive ? styles.active : ''}>
          Đặt Lịch
        </NavLink>
        <NavLink to="/manager/employees" className={({ isActive }) => isActive ? styles.active : ''}>
          Nhân Viên
        </NavLink>
        <NavLink to="/manager/branches" className={({ isActive }) => isActive ? styles.active : ''}>
          Chi Nhánh
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
