// src/manager/pages/Dashboard/DashboardLayout.tsx

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './ManagerLayout.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main
          className={styles.content}
          style={{ marginLeft: isCollapsed ? '50px' : '200px' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
