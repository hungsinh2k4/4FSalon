// src/manager/components/tables/EmployeesTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './EmployeesTable.module.css';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  // Thêm các trường khác nếu cần
}

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
          <th>Chức vụ</th>
          <th>Email</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.position}</td>
            <td>{employee.email}</td>
            <td>
              <Button onClick={() => onEdit(employee)}>Chỉnh sửa</Button>
              <Button onClick={() => onDelete(employee.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeesTable;
