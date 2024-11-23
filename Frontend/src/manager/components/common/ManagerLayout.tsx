// src\manager\components\common\ManagerLayout.tsx

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './ManagerLayout.module.css';

const ManagerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <div className={styles.container}>
      <Sidebar/>
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
};

export default ManagerLayout;
