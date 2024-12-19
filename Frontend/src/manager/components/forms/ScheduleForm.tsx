// src/manager/components/forms/ScheduleForm.tsx
import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './ScheduleForm.module.css';

interface ScheduleFormProps {
  initialData?: {
    employee_id: number;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    id: number;
    employee_name: string;
  };
  onSubmit: (data: any) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ initialData, onSubmit }) => {
  const [employee_id, setEmployeeId] = useState(initialData?.employee_id || '');
  const [monday, setMonday] = useState(initialData?.monday || false);
  const [tuesday, setTuesday] = useState(initialData?.tuesday || false);
  const [wednesday, setWednesday] = useState(initialData?.wednesday || false);
  const [thursday, setThursday] = useState(initialData?.thursday || false);
  const [friday, setFriday] = useState(initialData?.friday || false);
  const [saturday, setSaturday] = useState(initialData?.saturday || false);
  const [sunday, setSunday] = useState(initialData?.sunday || false);
  const [id, setId] = useState(initialData?.id || 0);
  const [employee_name, setEmployeeName] = useState(initialData?.employee_name || '');
  // Thêm các state cho các trường khác

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { employee_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, id, employee_name/* Thêm các trường khác */ };
    onSubmit(data);
  };

  return (
    <div>
    <form onSubmit={handleSubmit} className={styles.scheduleForm}>
      <Input
        label="ID nhân viên"
        type="number"
        value={employee_id}
        onChange={(e) => setEmployeeId(e.target.value)}
        required
      />
      <Input
        label="Thứ 2"
        type="checkbox"
        checked={monday}
        onChange={(e) => setMonday(e.target.checked)}
      />
      <Input
        label="Thứ 3"
        type="checkbox"
        checked={tuesday}
        onChange={(e) => setTuesday(e.target.checked)}
      />
      <Input
        label="Thứ 4"
        type="checkbox"
        checked={wednesday}
        onChange={(e) => setWednesday(e.target.checked)}
      />
      <Input
        label="Thứ 5"
        type="checkbox"
        checked={thursday}
        onChange={(e) => setThursday(e.target.checked)}
      />
      <Input
        label="Thứ 6"
        type="checkbox"
        checked={friday}
        onChange={(e) => setFriday(e.target.checked)}
      />
      <Input
        label="Thứ 7"
        type="checkbox"
        checked={saturday}
        onChange={(e) => setSaturday(e.target.checked)}
      />
      <Input
        label="Chủ nhật"
        type="checkbox"
        checked={sunday}
        onChange={(e) => setSunday(e.target.checked)}
      />
      <Button type="submit">Lưu</Button>
    </form>
    </div>
  );
};

export default ScheduleForm;
