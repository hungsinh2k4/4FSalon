// src/manager/components/forms/EmployeeForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './formcss.module.css';

interface EmployeeFormProps {
  initialData?: {
    id: number;
    name: string;
    phone: string;
    email: string;
    branch_id: number;
    work_position: string;
    available_from: string;
    available_to: string;
    status: boolean
  };
  onSubmit: (data: any) => void;
  type: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, type }) => {
  const [id, setId] = useState(initialData?.id || 10);
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [branch_id, setBranchId] = useState(initialData?.branch_id || '');
  const [work_position, setWorkPosition] = useState(initialData?.work_position || '');
  const [available_from, setAvailableFrom] = useState(initialData?.available_from || 'Monday');
  const [available_to, setAvailableTo] = useState(initialData?.available_to || 'Sunday');
  const [status, setStatus] = useState(initialData?.status || true);

  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {id, name, phone, email, branch_id, work_position, available_from, available_to, status};
    console.log("data",data);
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
        label="Chi nhánh"
        type="text"
        value={branch_id}
        onChange={(e) => setBranchId(Number(e.target.value))}
        required
      />  
      <Input
        label="Vị trí"
        type="text"
        value={work_position}
        onChange={(e) => setWorkPosition(e.target.value)}
        required
      />

      <Button type="submit" className={styles.submitButton}>{type}</Button>
</form>
  );
};

export default EmployeeForm;
