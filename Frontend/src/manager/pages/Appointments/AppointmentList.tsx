// src/manager/pages/Appointments/AppointmentList.tsx
import React, { useEffect, useState } from 'react';
import AppointmentsTable from '../../components/tables/AppointmentsTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';
import styles from './AppointmentList.module.css';
import { fetchAppointments, removeAppointment, addAppointment, editAppointment } from '../../services/appointmentService';

interface Appointment {
  id: number;
  clientName: string;
  serviceId: number;
  date: string;
  time: string;
  // Thêm các trường khác nếu cần
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null); // null cho Add, appointment cụ thể cho Edit

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) {
      try {
        await removeAppointment(id);
        setAppointments(appointments.filter((appointment) => appointment.id !== id));
      } catch (err) {
        setError('Failed to delete appointment.');
      }
    }
  };

  const handleAdd = () => {
    setCurrentAppointment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentAppointment) {
        // Edit appointment
        const editdAppointment = await editAppointment(currentAppointment.id, data);
        setAppointments(
          appointments.map((appointment) => (appointment.id === editdAppointment.id ? editdAppointment : appointment))
        );
      } else {
        // Add appointment
        const newAppointment = await addAppointment(data);
        setAppointments([...appointments, newAppointment]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save appointment.');
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className={styles.appointmentList}>
      <h2>Danh sách đặt lịch</h2>
      <div className={styles.actions}>
        <Button onClick={handleAdd}>Thêm đặt lịch</Button>
        <Input
          label=""
          type="text"
          placeholder="Tìm kiếm theo tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <AppointmentsTable appointments={filteredAppointments} onDelete={handleDelete} onEdit={handleEdit} />
      
      {/* Modal cho Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAppointment ? 'Chỉnh sửa đặt lịch' : 'Thêm đặt lịch'}
      >
        <AppointmentForm initialData={currentAppointment || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default AppointmentList;
