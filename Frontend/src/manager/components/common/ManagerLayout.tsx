// src/manager/pages/Dashboard/DashboardLayout.tsx

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './ManagerLayout.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={styles.main}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
