// src/manager/components/Sidebar/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logo from '../../assets/images/manager_logo.png';

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
  FaEllipsisVertical, //collapse
  FaBars // expand
} from 'react-icons/fa6';

// Định nghĩa giao diện cho các props
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
const navItems = [
  { to: "/manager/dashboard", linkText: "Dashboard", icon: <FaBuffer className={styles.icon} /> },
  { to: "/manager/accounts", linkText: "Tài Khoản", icon: <FaUser className={styles.icon} /> },
  { to: "/manager/feedbacks", linkText: "Phản Hồi", icon: <FaComments className={styles.icon} /> },
  { to: "/manager/services", linkText: "Dịch Vụ", icon: <FaBagShopping className={styles.icon} /> },
  { to: "/manager/schedules", linkText: "Lịch Làm Việc", icon: <FaCalendar className={styles.icon} /> },
  { to: "/manager/appointments", linkText: "Đặt Lịch", icon: <FaCalendarCheck className={styles.icon} /> },
  { to: "/manager/employees", linkText: "Nhân Viên", icon: <FaUsers className={styles.icon} /> },
  { to: "/manager/branches", linkText: "Chi Nhánh", icon: <FaBuilding className={styles.icon} /> },
 
  { to: "/manager/dashboard", linkText: "Dashboard", icon: <FaBuffer className={styles.icon} /> },
  { to: "/manager/accounts", linkText: "Tài Khoản", icon: <FaUser className={styles.icon} /> },
  { to: "/manager/feedbacks", linkText: "Phản Hồi", icon: <FaComments className={styles.icon} /> },
  { to: "/manager/services", linkText: "Dịch Vụ", icon: <FaBagShopping className={styles.icon} /> },
  { to: "/manager/schedules", linkText: "Lịch Làm Việc", icon: <FaCalendar className={styles.icon} /> },
  { to: "/manager/appointments", linkText: "Đặt Lịch", icon: <FaCalendarCheck className={styles.icon} /> },
  { to: "/manager/employees", linkText: "Nhân Viên", icon: <FaUsers className={styles.icon} /> },
  { to: "/manager/branches", linkText: "Chi Nhánh", icon: <FaBuilding className={styles.icon} /> },
  { to: "/manager/dashboard", linkText: "Dashboard", icon: <FaBuffer className={styles.icon} /> },
  { to: "/manager/accounts", linkText: "Tài Khoản", icon: <FaUser className={styles.icon} /> },
  { to: "/manager/feedbacks", linkText: "Phản Hồi", icon: <FaComments className={styles.icon} /> },
  { to: "/manager/services", linkText: "Dịch Vụ", icon: <FaBagShopping className={styles.icon} /> },
  { to: "/manager/schedules", linkText: "Lịch Làm Việc", icon: <FaCalendar className={styles.icon} /> },
  { to: "/manager/appointments", linkText: "Đặt Lịch", icon: <FaCalendarCheck className={styles.icon} /> },
  { to: "/manager/employees", linkText: "Nhân Viên", icon: <FaUsers className={styles.icon} /> },
  { to: "/manager/branches", linkText: "Chi Nhánh", icon: <FaBuilding className={styles.icon} /> },
  { to: "/manager/dashboard", linkText: "Dashboard", icon: <FaBuffer className={styles.icon} /> },
  { to: "/manager/accounts", linkText: "Tài Khoản", icon: <FaUser className={styles.icon} /> },
  { to: "/manager/feedbacks", linkText: "Phản Hồi", icon: <FaComments className={styles.icon} /> },
  { to: "/manager/services", linkText: "Dịch Vụ", icon: <FaBagShopping className={styles.icon} /> },
  { to: "/manager/schedules", linkText: "Lịch Làm Việc", icon: <FaCalendar className={styles.icon} /> },
  { to: "/manager/appointments", linkText: "Đặt Lịch", icon: <FaCalendarCheck className={styles.icon} /> },
  { to: "/manager/employees", linkText: "Nhân Viên", icon: <FaUsers className={styles.icon} /> },
  { to: "/manager/branches", linkText: "Chi Nhánh", icon: <FaBuilding className={styles.icon} /> },
];
const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
    <div className={`${styles.header} ${isCollapsed ? styles.collapsed : ''}`}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <button className={styles.toggleButton} onClick={handleToggle}>
          {isCollapsed ? (
            <FaBars className={styles.toggleIcon} />
          ) : (
            <FaEllipsisVertical className={styles.toggleIcon} />
          )}
        </button>
      </div>
    <div className={`${styles.scroll} ${isCollapsed ? styles.collapsed : ''}`}>
      
      <div className={styles.can_scroll}>
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
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
