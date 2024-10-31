// src/manager/pages/Schedules/ScheduleList.tsx
import React, { useEffect, useState } from 'react';
import SchedulesTable from '../../components/tables/SchedulesTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ScheduleForm from '../../components/forms/ScheduleForm';
import styles from './ScheduleList.module.css';
import { fetchSchedules, removeSchedule, addSchedule, editSchedule } from '../../services/scheduleService';

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  // Thêm các trường khác nếu cần
}

const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null); // null cho Add, schedule cụ thể cho Edit

  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      try {
        const data = await fetchSchedules();
        setSchedules(data);
      } catch (err) {
        setError('Failed to fetch schedule.');
      } finally {
        setLoading(false);
      }
    };
    loadSchedules();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      try {
        await removeSchedule(id);
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
      } catch (err) {
        setError('Failed to delete schedule.');
      }
    }
  };

  const handleAdd = () => {
    setCurrentSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentSchedule) {
        // Edit schedule
        const editdSchedule = await editSchedule(currentSchedule.id, data);
        setSchedules(
          schedules.map((schedule) => (schedule.id === editdSchedule.id ? editdSchedule : schedule))
        );
      } else {
        // Add schedule
        const newSchedule = await addSchedule(data);
        setSchedules([...schedules, newSchedule]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save schedule.');
    }
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.date.includes(searchTerm) // Ví dụ tìm kiếm theo ngày
  );

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className={styles.scheduleList}>
      <h2>Danh sách lịch làm việc</h2>
      <div className={styles.actions}>
        <Button onClick={handleAdd}>Thêm lịch</Button>
        <Input
          label=""
          type="text"
          placeholder="Tìm kiếm theo ngày..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <SchedulesTable schedules={filteredSchedules} onDelete={handleDelete} onEdit={handleEdit} />
      
      {/* Modal cho Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSchedule ? 'Chỉnh sửa lịch làm việc' : 'Thêm lịch làm việc'}
      >
        <ScheduleForm initialData={currentSchedule || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default ScheduleList;
