// src/manager/components/tables/SchedulesTable.tsx
import React, { useState } from 'react';
import styles from '../common/global.module.css';
import { Employee } from '../../utils/types';
import { FaCheck, FaPen, FaX } from 'react-icons/fa6';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Schedule } from "../../utils/types";


interface SchedulesTableProps {
  schedules: Schedule[];
  onDelete: (id: number) => void;
  onEdit: (schedule: Schedule) => void;
}

const SchedulesTable: React.FC<SchedulesTableProps> = ({ schedules, onDelete, onEdit }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Schedule, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'asc' });

  const sorted = [...schedules].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Schedule) => {
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
    <table className={styles.table}>
      <colgroup>
        <col style={{ width: '5%' }} />
        <col style={{ width: '7%' }} />
        <col style={{ width: '15%' }} />
      </colgroup>
      <thead>
        <tr>
          <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
          <th onClick={() => handleSort('employee_id')}>ID NV <FontAwesomeIcon icon={getSortIcon('employee_id')} /></th>
          <th onClick={() => handleSort('employee_name')}>Tên NV <FontAwesomeIcon icon={getSortIcon('employee_name')} /></th>
          <th onClick={() => handleSort('monday')}>Thứ 2 <FontAwesomeIcon icon={getSortIcon('monday')} /></th>
          <th onClick={() => handleSort('tuesday')}>Thứ 3 <FontAwesomeIcon icon={getSortIcon('tuesday')} /></th>
          <th onClick={() => handleSort('wednesday')}>Thứ 4 <FontAwesomeIcon icon={getSortIcon('wednesday')} /></th>
          <th onClick={() => handleSort('thursday')}>Thứ 5 <FontAwesomeIcon icon={getSortIcon('thursday')} /></th>
          <th onClick={() => handleSort('friday')}>Thứ 6 <FontAwesomeIcon icon={getSortIcon('friday')} /></th>
          <th onClick={() => handleSort('saturday')}>Thứ 7 <FontAwesomeIcon icon={getSortIcon('saturday')} /></th>
          <th onClick={() => handleSort('sunday')}>Chủ nhật <FontAwesomeIcon icon={getSortIcon('sunday')} /></th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((schedule) => (
          <tr key={schedule.id}>
            <td>{schedule.id}</td>
            <td>{schedule.employee_id}</td>
            <td>{schedule.employee_name}</td>
            <td>{(schedule.monday) ? <FaCheck /> : <FaX />}</td>
            <td>{(schedule.tuesday) ? <FaCheck /> : <FaX />}</td>
            <td>{(schedule.wednesday) ? <FaCheck /> : <FaX />}</td>
            <td>{(schedule.thursday) ? <FaCheck /> : <FaX />}</td>
            <td>{(schedule.friday) ? <FaCheck /> : <FaX />}</td>
            <td>{(schedule.saturday) ? <FaCheck /> : <FaX />}</td>
            <td>{(schedule.sunday) ? <FaCheck /> : <FaX />}</td>
            <td className={styles.actionList}>
            <FaPen className={styles.actionEdit} onClick={() => onEdit(schedule)}/>
            <FaX className={styles.actionDelete} onClick={() => onDelete(schedule.id)}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default SchedulesTable;
