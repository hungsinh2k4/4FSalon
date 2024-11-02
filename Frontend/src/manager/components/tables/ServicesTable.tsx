// src/manager/components/tables/ServicesTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './ServicesTable.module.css';
import { Service } from '../../utils/types';

interface ServicesTableProps {
  services: Service[];
  onDelete: (id: number) => void;
  onEdit: (service: Service) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ services, onDelete, onEdit }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên dịch vụ</th>
          <th>Giá</th>
          <th>Thời gian ước tính (phút)</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td>{service.id}</td>
            <td>{service.title}</td>
            <td>{service.price}</td>
            <td>{service.estimate_time}</td>
            <td>
              <Button onClick={() => onEdit(service)}>Chỉnh sửa</Button>
              <Button onClick={() => onDelete(service.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServicesTable;
