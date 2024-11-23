// src/manager/components/tables/SchedulesTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './SchedulesTable.module.css';
import { Employee } from '../../utils/types';
import { FaCheck, FaPen, FaX } from 'react-icons/fa6';

interface Schedule {
  id: number;
  employee_id: number;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  employee: Employee;
  // Thêm các trường khác nếu cần
}

interface SchedulesTableProps {
  schedules: Schedule[];
  onDelete: (id: number) => void;
  onEdit: (schedule: Schedule) => void;
}

const SchedulesTable: React.FC<SchedulesTableProps> = ({ schedules, onDelete, onEdit }) => {
  return (
    <div className={styles.tableContainer}>
    <table className={styles.table}>
      <colgroup>
        <col style={{ width: '5%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '15%' }} />
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>Mã nhân viên</th>
          <th>Tên nhân viên</th>
          <th>Thứ 2</th>
          <th>Thứ 3</th>
          <th>Thứ 4</th>
          <th>Thứ 5</th>
          <th>Thứ 6</th>
          <th>Thứ 7</th>
          <th>Chủ nhật</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td>{schedule.id}</td>
            <td>{schedule.employee.id}</td>
            <td>{schedule.employee.name}</td>
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
