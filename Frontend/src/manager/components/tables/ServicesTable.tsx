// src/manager/components/tables/ServicesTable.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FaPen, FaXmark } from 'react-icons/fa6';

import Button from '../common/Button';
import styles from './ServicesTable.module.css';
import { Service } from '../../utils/types';

interface ServicesTableProps {
  services: Service[];
  onDelete: (id: number) => void;
  onEdit: (service: Service) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ services, onDelete, onEdit }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Service, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: '' });

  const sorted = [...services].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Service) => {
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
            <col style={{ width: '5%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
            <th onClick={() => handleSort('title')}>Tên dịch vụ <FontAwesomeIcon icon={getSortIcon('title')} /></th>
            <th onClick={() => handleSort('price')}>Giá <FontAwesomeIcon icon={getSortIcon('price')} /></th>
            <th onClick={() => handleSort('estimate_time')}>Thời gian <FontAwesomeIcon icon={getSortIcon('estimate_time')} /></th>
            <th onClick={() => handleSort('created_at')}>Ngày tạo <FontAwesomeIcon icon={getSortIcon('created_at')} /></th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.title}</td>
              <td>{service.price.toLocaleString('vi-VN')}vnđ</td>
              <td>{service.estimate_time} phút</td>
              <td>{service.created_at}</td>
              <td className={styles.actionList}>
                <FaPen className={styles.actionEdit} onClick={() => onEdit(service)}/> 
                <FaXmark className={styles.actionDelete} onClick={() => onDelete(service.id)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  );
};

export default ServicesTable;
