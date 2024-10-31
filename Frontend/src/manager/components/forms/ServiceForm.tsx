// src/manager/components/forms/ServiceForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ServiceForm.module.css';

interface ServiceFormProps {
  initialData?: {
    name: string;
    price: number;
    estimatedTime: string;
    // Thêm các trường cần thiết
  };
  onSubmit: (data: any) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimatedTime || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, price, estimatedTime /* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.serviceForm}>
      <Input
        label="Tên dịch vụ"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Giá"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />
      <Input
        label="Thời gian ước tính (phút)"
        type="number"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
        required
      />
      {/* Thêm các Input khác */}
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default ServiceForm;
