// src/manager/components/Sidebar/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';


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
  FaAngleLeft, //collapse
  FaAngleRight // expand
} from 'react-icons/fa6';

// Định nghĩa giao diện cho các props
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
const navItems1 = [
  { to: "/manager/dashboard", linkText: "Dashboard", icon: <FaBuffer className={styles.icon} /> },
  { to: "/manager/accounts", linkText: "Quản lý Tài Khoản", icon: <FaUser className={styles.icon} /> },
  { to: "/manager/branches", linkText: "Quản lý Chi Nhánh", icon: <FaBuilding className={styles.icon} /> },
  
  { to: "/manager/schedules", linkText: "Quản lý Lịch Làm Việc", icon: <FaCalendar className={styles.icon} /> },
  { to: "/manager/appointments", linkText: "Quản lý Lịch Hẹn", icon: <FaCalendarCheck className={styles.icon} /> },
  { to: "/manager/feedbacks", linkText: "Quản lý Phản Hồi", icon: <FaComments className={styles.icon} /> },
  { to: "/manager/employees", linkText: "Quản lý Nhân Viên", icon: <FaUsers className={styles.icon} /> },
  { to: "/manager/services", linkText: "Quản lý Dịch Vụ", icon: <FaBagShopping className={styles.icon} /> },
];
const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      
      <div className={styles.header}>
        
        <button className={styles.toggleButton} onClick={handleToggle}>
          {isCollapsed ? (
            <FaAngleRight className={styles.toggleIcon} />
          ) : (
            <FaAngleLeft className={styles.toggleIcon} />
          )}
        </button>
      </div>
      <div className={styles.scroll}>
        <div className={styles.list}>
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
        
      </div>
    </div>
  );
};

export default Sidebar;
