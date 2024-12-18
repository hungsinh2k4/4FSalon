// src/manager/components/forms/AccountForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './AccountForm.module.css';
import { Account } from '../../utils/types';

interface AccountFormProps {
  initialData?: {
    id: number;
    email: string;
    password: string;
    google_id: string;
    role: string;
  };
  onSubmit: (data: any) => void;
}

enum Role {
  Admin = 'admin',
  Manager = 'manager',
  Customer = 'customer',
}

const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSubmit }) => {
  const [id, setId] = useState<number>(initialData?.id || 0);
  const [password, setPassword] = useState<string>(initialData?.password || '');
  const [google_id, setGoogleId] = useState<string>(initialData?.google_id || '');
  const [email, setEmail] = useState<string>(initialData?.email || '');
  const [role, setRole] = useState<string>(initialData?.role || '');
  // Thêm các state cho các trường khác nếu cần

  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email);
      setRole(initialData.role);
      // Cập nhật các trường khác nếu cần
    } else {
      setEmail('');
      setRole
      // Reset các trường khác nếu cần
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Account> = { email, role };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.accountForm}>
      <h3>{initialData ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}</h3>
      <label className={styles.label}>Loại tài khoản</label>
      <select 
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required={true}  
      >
        <option value={Role.Admin}>admin</option>
        <option value={Role.Manager}>manager</option>
        <option value={Role.Customer}>customer</option>
      </select>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Thêm các Input khác nếu cần */}
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default AccountForm;
