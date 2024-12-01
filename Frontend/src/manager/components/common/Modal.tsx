// src/manager/components/common/Modal.tsx
import React, { useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <p className={styles.title}>{title}</p>
          <button onClick={onClose} className={styles.actionDelete}>
            &times;
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
