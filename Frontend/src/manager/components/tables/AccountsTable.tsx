// src/manager/components/tables/AccountsTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './AccountsTable.module.css';
import { Account } from '../../utils/types';

interface AccountsTableProps {
  accounts: Account[];
  onDelete: (id: number) => void;
  onEdit: (account: Account) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onDelete, onEdit }) => {
  return (
    <table className={`${styles.table} fadeIn`}>
      <thead> 
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Role</th>
          <th>Ngày tạo</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <tr key={account.id}>
            <td>{account.id}</td>
            <td>{account.email}</td>
            <td>{account.role}</td>
            <td>{account.created_at}</td>
            <td>
              <Button variant="primary" width='50px' onClick={() => onEdit(account)}>Sửa</Button>
              <Button variant="danger" width='50px' onClick={() => onDelete(account.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccountsTable;
