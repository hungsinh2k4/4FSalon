// src/manager/components/forms/AccountForm.tsx
import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './AccountForm.module.css';
import { Account } from '../../utils/types';

interface AccountFormProps {
  initialData?: Account | null;
  onSubmit: (data: Partial<Account>) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSubmit }) => {
  const [username, setUsername] = useState<string>(initialData?.username || '');
  const [email, setEmail] = useState<string>(initialData?.email || '');
  // Thêm các state cho các trường khác nếu cần

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setEmail(initialData.email);
      // Cập nhật các trường khác nếu cần
    } else {
      setUsername('');
      setEmail('');
      // Reset các trường khác nếu cần
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Account> = { username, email /* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.accountForm}>
      <h3>{initialData ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}</h3>
      <Input
        label="Tên đăng nhập"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
