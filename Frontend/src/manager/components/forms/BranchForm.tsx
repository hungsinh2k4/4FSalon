// src/manager/components/forms/BranchForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './BranchForm.module.css';

interface BranchFormProps {
  initialData?: {
    name: string;
    address: string;
    seats: number;
    facilities: string;
    // Thêm các trường cần thiết
  };
  onSubmit: (data: any) => void;
}

const BranchForm: React.FC<BranchFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [seats, setSeats] = useState(initialData?.seats || 0);
  const [facilities, setFacilities] = useState(initialData?.facilities || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, address, seats, facilities /* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.branchForm}>
      <Input
        label="Tên chi nhánh"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Địa chỉ"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <Input
        label="Số ghế"
        type="number"
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
        required
      />
      <Input
        label="Cơ sở vật chất"
        type="text"
        value={facilities}
        onChange={(e) => setFacilities(e.target.value)}
        required
      />
      {/* Thêm các Input khác */}
      <Button type="submit">Lưu</Button>
    </form>
  );
};

export default BranchForm;
