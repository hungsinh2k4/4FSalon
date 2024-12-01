// src/manager/components/common/Modal.tsx
import React, { useEffect } from 'react';
import styles from './ModalWaiting.module.css';

interface ModalProps {
  isOpen: boolean;
}

const ModalWaiting: React.FC<ModalProps> = ({ isOpen }) => {

  if (!isOpen) return null;


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
          <div className={styles.modalContent}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    </div>
  );
};

export default ModalWaiting;
