// src/manager/components/tables/EmployeesTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './EmployeesTable.module.css';
import { Employee } from '../../utils/types';

interface EmployeesTableProps {
  employees: Employee[];
  onDelete: (id: number) => void;
  onEdit: (employee: Employee) => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, onDelete, onEdit }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên nhân viên</th>
          <th>SĐT</th>
          <th>Email</th>
          <th>Chi nhánh</th>
          <th>Vị trí</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.phone}</td>
            <td>{employee.email}</td>
            <td>{employee.branch_id}</td>
            <td>{employee.work_position}</td>
            <td>
            <Button variant="primary" width='50px' onClick={() => onEdit(employee)}>Sửa</Button>
            <Button variant="danger" width='50px' onClick={() => onDelete(employee.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeesTable;
