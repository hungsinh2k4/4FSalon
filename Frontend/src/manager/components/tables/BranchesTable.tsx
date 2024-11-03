// src/manager/components/tables/BranchesTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './BranchesTable.module.css';

interface Branch {
  id: number;
  name: string;
  address: string;
  seats: number;
  facilities: string;
  // Thêm các trường khác nếu cần
}

interface BranchesTableProps {
  branches: Branch[];
  onDelete: (id: number) => void;
  onEdit: (branch: Branch) => void;
}

const BranchesTable: React.FC<BranchesTableProps> = ({ branches, onDelete, onEdit }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên chi nhánh</th>
          <th>Địa chỉ</th>
          <th>Số ghế</th>
          <th>Cơ sở vật chất</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((branch) => (
          <tr key={branch.id}>
            <td>{branch.id}</td>
            <td>{branch.name}</td>
            <td>{branch.address}</td>
            <td>{branch.seats}</td>
            <td>{branch.facilities}</td>
            <td>
              <Button onClick={() => onEdit(branch)}>Chỉnh sửa</Button>
              <Button onClick={() => onDelete(branch.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BranchesTable;
