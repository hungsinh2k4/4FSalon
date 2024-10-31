// src/manager/components/tables/AccountsTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './AccountsTable.module.css';

interface Account {
  id: number;
  username: string;
  email: string;
  // Thêm các trường khác nếu cần
}

interface AccountsTableProps {
  accounts: Account[];
  onDelete: (id: number) => void;
  onEdit: (account: Account) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onDelete, onEdit }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id}>
            <td>{account.id}</td>
            <td>{account.username}</td>
            <td>{account.email}</td>
            <td>
              <Button onClick={() => onEdit(account)}>Chỉnh sửa</Button>
              <Button onClick={() => onDelete(account.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccountsTable;
