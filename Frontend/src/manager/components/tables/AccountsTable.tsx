// src/manager/components/tables/AccountsTable.tsx
import React, {useState} from 'react';
import styles from '../../components/common/global.module.css';
import { Account } from '../../utils/types';
import { FaPen, FaXmark } from 'react-icons/fa6';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface AccountsTableProps {
  accounts: Account[];
  onDelete: (account: Account) => void;
  onEdit: (account: Account) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, onDelete, onEdit }) => {
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Account, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'asc' });

  const sorted = [...accounts].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Account) => {
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
        <col style={{ width: '10%' }} />
      </colgroup>
      <thead> 
        <tr>
          <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
          <th onClick={() => handleSort('email')}>Email <FontAwesomeIcon icon={getSortIcon('email')} /></th>
          <th onClick={() => handleSort('role')}>Role <FontAwesomeIcon icon={getSortIcon('role')} /></th>
          <th onClick={() => handleSort('id')}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((account) => (
          <tr key={account.id}>
            <td>{account.id}</td>
            <td>{account.email}</td>
            <td>{account.role}</td>
            <td className={styles.actionList}>
            <FaPen className={styles.actionEdit} onClick={() => onEdit(account)}/> 
              <FaXmark className={styles.actionDelete} onClick={() => onDelete(account)}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default AccountsTable;
