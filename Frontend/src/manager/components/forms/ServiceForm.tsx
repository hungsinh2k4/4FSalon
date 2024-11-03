// src/manager/components/forms/ServiceForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ServiceForm.module.css';

interface ServiceFormProps {
  initialData?: {
    title: string;
    description: string;
    estimate_time: number;
    price: number;
  };
  onSubmit: (data: any) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [description, setDescription] = useState(initialData?.description || '');
  const [estimate_time, setEstimateTime] = useState(initialData?.estimate_time || 0);
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, price, description, estimate_time };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.serviceForm}>
      <Input
        label="Tên dịch vụ"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        label="Mô tả"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        label="Thời gian ước tính (phút)"
        type="number"
        value={estimate_time}
        onChange={(e) => setEstimateTime(Number(e.target.value))}
        required
      />
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default ServiceForm;
