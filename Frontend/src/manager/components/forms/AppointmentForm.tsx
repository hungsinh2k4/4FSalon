// src/manager/components/forms/AppointmentForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './AppointmentForm.module.css';

interface AppointmentFormProps {
  initialData?: {
    clientName: string;
    serviceId: number;
    date: string;
    time: string;
    // Thêm các trường cần thiết
  };
  onSubmit: (data: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onSubmit }) => {
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [serviceId, setServiceId] = useState(initialData?.serviceId || 0);
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { clientName, serviceId, date, time /* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.appointmentForm}>
      <Input
        label="Tên khách hàng"
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
      />
      <Input
        label="Dịch vụ"
        type="number"
        value={serviceId}
        onChange={(e) => setServiceId(Number(e.target.value))}
        required
      />
      <Input
        label="Ngày"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Input
        label="Thời gian"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      {/* Thêm các Input khác */}
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default AppointmentForm;
