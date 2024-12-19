// src/manager/components/forms/BranchForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './formcss.module.css';

interface BranchFormProps {
  initialData?: {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    status: boolean;
    pỉcture_url: string;
    long: number;
    lat: number;
  };
  onSubmit: (data: any) => void;
  type: string;
}

const BranchForm: React.FC<BranchFormProps> = ({ initialData, onSubmit, type }) => {
  const [id, setId] = useState(initialData?.id || '');
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [status, setStatus] = useState<boolean>(initialData?.status || true);
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {id,  name, address, phone, email, status   };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.branchForm}>
      <Input
        label="Tên chi nhánh"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Địa chỉ"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
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
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Trạng thái hoạt động"
        type="checkbox"
        checked={status}
        onChange={(e) => setStatus(e.target.checked)}
        required
      />
      <Button type="submit">{type}</Button>
    </form>
  );
};

export default BranchForm;
