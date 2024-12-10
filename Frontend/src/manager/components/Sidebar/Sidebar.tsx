// src/manager/components/Sidebar/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import AuthService from '../../services/authService';

/* Import các icon từ React Icons */

import { 
  FaBuffer,  //dashboard
  FaUser, //user
  FaComments, //feedback
  FaBagShopping, //service
  FaCalendar, //schedule
  FaCalendarCheck, //appointment
  FaUsers, //employee
  FaBuilding, //branch
  FaDoorOpen,
  FaChartColumn, //logout
} from 'react-icons/fa6';
import logo from '../../assets/images/logo.png';
// Định nghĩa giao diện cho các props
const navItems1 = [
  { to: "/manager/dashboard", linkText: "Dashboard", icon: <FaBuffer className={styles.icon} /> },
  { to: "/manager/accounts", linkText: "Tài Khoản", icon: <FaUser className={styles.icon} /> },
  { to: "/manager/branches", linkText: "Chi Nhánh", icon: <FaBuilding className={styles.icon} /> },
  
  { to: "/manager/schedules", linkText: "Lịch Làm Việc", icon: <FaCalendar className={styles.icon} /> },
  { to: "/manager/appointments", linkText: "Lịch Hẹn", icon: <FaCalendarCheck className={styles.icon} /> },
  { to: "/manager/feedbacks", linkText: "Phản Hồi", icon: <FaComments className={styles.icon} /> },
  { to: "/manager/employees", linkText: "Nhân Viên", icon: <FaUsers className={styles.icon} /> },
  { to: "/manager/services", linkText: "Dịch Vụ", icon: <FaBagShopping className={styles.icon} /> },
  { to: "/manager/statistics", linkText: "Thống kê", icon: <FaChartColumn className={styles.icon} /> },
];
const Sidebar: React.FC = () => {
  const log = () => {
    AuthService.logout();
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.logobar}>
          <img src={logo} className={styles.logo} alt="logo" />
          MANAGER
      </div>
      <div className={styles.menu}>
        <nav className={styles.nav}>
          {navItems1.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.to}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
          <div className={styles.iconWrapper}>
            {item.icon}
          </div>
          <span className={styles.linkText}>{item.linkText}</span>
        </NavLink>
          ))}
        </nav>
      </div>
      <div className={styles.logout} onClick={log}>
        <FaDoorOpen className={styles.logouticon} />
        <span className={styles.loggouttext}>Đăng Xuất</span>
      </div>
    </div>
  );

};

export default Sidebar;
