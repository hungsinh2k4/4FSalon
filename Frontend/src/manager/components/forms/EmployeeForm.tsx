// src/manager/components/forms/EmployeeForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
  initialData?: {
    name: string;
    phone: string;
    email: string;
    branch_id: number;
    work_position: string;
  };
  onSubmit: (data: any) => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [branch_id, setBranchId] = useState(initialData?.branch_id || '');
  const [work_position, setWorkPosition] = useState(initialData?.work_position || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, phone, email, branch_id, work_position /* Thêm các trường khác */ };
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
        label="Số điện thoại"
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Vị trí"
        type="text"
        value={work_position}
        onChange={(e) => setWorkPosition(e.target.value)}
        required
      />

      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default EmployeeForm;
