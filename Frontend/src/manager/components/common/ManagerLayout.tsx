// src/manager/pages/Dashboard/DashboardLayout.tsx

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './ManagerLayout.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={styles.content}
        style={{ marginLeft: isCollapsed ? '50px' : '200px' }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
