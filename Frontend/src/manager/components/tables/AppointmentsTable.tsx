// src/manager/components/tables/AppointmentsTable.tsx
import React, { useState } from 'react';
import Button from '../common/Button';
import styles from './AppointmentsTable.module.css';
import { Appointment } from '../../utils/types';
import { FaPen, FaXmark } from 'react-icons/fa6';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onDelete: (id: number) => void;
  onEdit: (appointment: Appointment) => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments, onDelete, onEdit }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Appointment, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'asc' });

  const sorted = [...appointments].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Appointment) => {
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
    <table>
      <colgroup>
      <col style ={{width: "5%"}} />
      </colgroup>
      <thead>
        <tr>
          <th onClick={() => handleSort("id")}>ID<FontAwesomeIcon icon={getSortIcon('id')} /></th>
          <th onClick={() => handleSort("clientName")}>Tên khách hàng<FontAwesomeIcon icon={getSortIcon('clientName')} /></th>
          <th onClick={() => handleSort("service_id")}>ID Dịch vụ<FontAwesomeIcon icon={getSortIcon('service_id')} /></th>
          <th onClick={() => handleSort("date")}>Ngày<FontAwesomeIcon icon={getSortIcon('date')} /></th>
          <th onClick={() => handleSort("time")}>Thời gian<FontAwesomeIcon icon={getSortIcon('time')} /></th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((appointment) => (
          <tr key={appointment.id}>
            <td>{appointment.id}</td>
            <td>{appointment.clientName}</td>
            <td>{appointment.service_id}</td>
            <td>{appointment.date}</td>
            <td>{appointment.time}</td>
            <td className={styles.actionList}>
            <FaPen className={styles.actionEdit} onClick={() => onEdit(appointment)}/> 
            <FaXmark className={styles.actionDelete} onClick={() => onDelete(appointment.id)}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentsTable;
