// src/manager/components/tables/BranchesTable.tsx
import React, { useState } from 'react';
import styles from '../../components/common/global.module.css';
import { FaPen, FaXmark } from 'react-icons/fa6';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Branch } from '../../utils/types';

interface BranchesTableProps {
  branches: Branch[];
  onDelete: (branch: Branch) => void;
  onEdit: (branch: Branch) => void;
}

const BranchesTable: React.FC<BranchesTableProps> = ({ branches, onDelete, onEdit }) => {

  const [sortConfig, setSortConfig] = useState<{ key: keyof Branch, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'asc' });

  const sorted = [...branches].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Branch) => {
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
    <table >
      <colgroup>
        <col style={{ width: '5%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '30%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '7%' }} />
      </colgroup>
      <thead>
        <tr>
          <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
          <th onClick={() => handleSort('name')}>Tên chi nhánh <FontAwesomeIcon icon={getSortIcon('name')} /></th>
          <th onClick={() => handleSort('address')}>Địa chỉ <FontAwesomeIcon icon={getSortIcon('address')} /></th>
          <th onClick={() => handleSort('phone')}>SDT<FontAwesomeIcon icon={getSortIcon('phone')} /></th>
          <th onClick={() => handleSort('email')}>Email <FontAwesomeIcon icon={getSortIcon('email')} /></th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((branch) => (
          <tr key={branch.id}>
            <td>{branch.id}</td>
            <td>{branch.name}</td>
            <td>{branch.address}</td>
            <td>{branch.phone}</td>
            <td>{branch.email}</td>
            <td className={styles.actionList}>
              <FaPen className={styles.actionEdit} onClick={() => onEdit(branch)} />
              <FaXmark className={styles.actionDelete} onClick={() => onDelete(branch)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default BranchesTable;
