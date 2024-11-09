// src/manager/components/common/Button.tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'link' | 'delete' | 'edit';
  width?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', width, children, ...props }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      style={{ width }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;