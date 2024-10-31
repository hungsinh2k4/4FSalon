// src/manager/components/forms/EmployeeForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  initialData?: {
    name: string;
    position: string;
    email: string;
    // Thêm các trường cần thiết
  };
  onSubmit: (data: any) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [email, setEmail] = useState(initialData?.email || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, position, email /* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.employeeForm}>
      <Input
        label="Tên nhân viên"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Chức vụ"
        type="text"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Thêm các Input khác */}
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default EmployeeForm;
