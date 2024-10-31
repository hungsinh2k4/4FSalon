// src/manager/pages/Dashboard/Dashboard.tsx
import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import styles from './Dashboard.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <div className={styles.contentArea}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
