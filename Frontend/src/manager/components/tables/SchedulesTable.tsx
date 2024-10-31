// src/manager/components/tables/SchedulesTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './SchedulesTable.module.css';

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  // Thêm các trường khác nếu cần
}

interface SchedulesTableProps {
  schedules: Schedule[];
  onDelete: (id: number) => void;
  onEdit: (schedule: Schedule) => void;
}

const SchedulesTable: React.FC<SchedulesTableProps> = ({ schedules, onDelete, onEdit }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ngày</th>
          <th>Thời gian bắt đầu</th>
          <th>Thời gian kết thúc</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td>{schedule.id}</td>
            <td>{schedule.date}</td>
            <td>{schedule.startTime}</td>
            <td>{schedule.endTime}</td>
            <td>
              <Button onClick={() => onEdit(schedule)}>Chỉnh sửa</Button>
              <Button onClick={() => onDelete(schedule.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SchedulesTable;
