// src/manager/components/tables/EmployeesTable.tsx
import React, { useState } from 'react';
import styles from '../../components/common/global.module.css';
import { Employee } from '../../utils/types';
import { FaPen, FaXmark } from 'react-icons/fa6';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface EmployeesTableProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, onDelete, onEdit }) => {
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'asc' });

  const sorted = [...employees].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Employee) => {
    setSortConfig((prevState) => {
      const direction = prevState.key === key && prevState.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  };

  return (
    <div className={styles.tableContainer}>
      <table>
        <colgroup>
          <col style={{ width: '5%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
            <th onClick={() => handleSort('name')}>Tên nhân viên <FontAwesomeIcon icon={getSortIcon('name')} /></th>
            <th onClick={() => handleSort('phone')}>SĐT <FontAwesomeIcon icon={getSortIcon('phone')} /></th>
            <th onClick={() => handleSort('email')}>Email <FontAwesomeIcon icon={getSortIcon('email')} /></th>
            <th onClick={() => handleSort('branch_id')}>Chi nhánh <FontAwesomeIcon icon={getSortIcon('branch_id')} /></th>
            <th onClick={() => handleSort('work_position')}>Vị trí <FontAwesomeIcon icon={getSortIcon('work_position')} /></th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.email}</td>
              <td>{employee.branch_id}</td>
              <td>{employee.work_position}</td>
              <td className={styles.actionList}>
                <FaPen className={styles.actionEdit} onClick={() => onEdit(employee)}/> 
                <FaXmark className={styles.actionDelete} onClick={() => onDelete(employee)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesTable;
