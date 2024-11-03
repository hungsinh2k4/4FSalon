// src/manager/components/tables/AppointmentsTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './AppointmentsTable.module.css';

interface Appointment {
  id: number;
  clientName: string;
  serviceId: number;
  date: string;
  time: string;
  // Thêm các trường khác nếu cần
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  onDelete: (id: number) => void;
  onEdit: (appointment: Appointment) => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments, onDelete, onEdit }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên khách hàng</th>
          <th>ID Dịch vụ</th>
          <th>Ngày</th>
          <th>Thời gian</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => (
          <tr key={appointment.id}>
            <td>{appointment.id}</td>
            <td>{appointment.clientName}</td>
            <td>{appointment.serviceId}</td>
            <td>{appointment.date}</td>
            <td>{appointment.time}</td>
            <td>
              <Button onClick={() => onEdit(appointment)}>Chỉnh sửa</Button>
              <Button onClick={() => onDelete(appointment.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AppointmentsTable;
