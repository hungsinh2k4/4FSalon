// src/manager/components/forms/ScheduleForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ScheduleForm.module.css';

interface ScheduleFormProps {
  initialData?: {
    date: string;
    startTime: string;
    endTime: string;
    // Thêm các trường cần thiết
  };
  onSubmit: (data: any) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ initialData, onSubmit }) => {
  const [date, setDate] = useState(initialData?.date || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { date, startTime, endTime /* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.scheduleForm}>
      <Input
        label="Ngày"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Input
        label="Thời gian bắt đầu"
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <Input
        label="Thời gian kết thúc"
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      {/* Thêm các Input khác */}
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default ScheduleForm;
