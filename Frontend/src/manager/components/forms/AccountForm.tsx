// src/manager/components/forms/AccountForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './formcss.module.css';

interface AccountFormProps {
  initialData?: {
    id: number;
    email: string;
    password: string;
    google_id: string;
    role: string;
  };
  onSubmit: (data: any) => void;
  type: string;
}

enum Role {
  Manager = 'manager',
  Customer = 'customer',
}

const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSubmit, type }) => {
  const [id, setId] = useState<number>(initialData?.id || 0);
  const [password, setPassword] = useState<string>('');
  const [google_id, setGoogleId] = useState<string>(initialData?.google_id || '');
  const [email, setEmail] = useState<string>(initialData?.email || '');
  const [role, setRole] = useState<string>(initialData?.role || '');
  // Thêm các state cho các trường khác nếu cần

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {id, email, role, password};
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.accountForm}>
      <label className={styles.label}>Loại tài khoản</label>
      <br></br>
      <select 
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required={true}  
      >
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
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className={styles.submitButton}>{type}</Button>
    </form>
  );
};

export default AccountForm;
