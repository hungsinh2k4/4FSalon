// src/manager/pages/Appointments/AppointmentList.tsx
import React, { useEffect, useState } from 'react';
import AppointmentsTable from '../../components/tables/AppointmentsTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';
import styles from './AppointmentList.module.css';
import { fetchAppointments, removeAppointment, addAppointment, editAppointment, editCustomer } from '../../services/appointmentService';
import { Appointment } from '../../utils/types';
import { FaCalendar } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { editAccount } from '../../services/accountService';

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



  const handleDelete = async (currentAppointment: Appointment) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt lịch này?')) {
      try {
        await removeAppointment(currentAppointment.id);
        currentAppointment.customer.points += currentAppointment?.voucher?.required_point ?? 0;
        await editCustomer(currentAppointment.customer.id, currentAppointment.customer);
        setAppointments(appointments.filter((appointment) => appointment.id !== currentAppointment.id));
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
        await editCustomer(currentAppointment.customer.id, data.customer);
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
    // appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    appointment
  );



  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>

          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper}>
              <FaCalendar /> <p>Quản lý đặt lịch</p>
            </div>

          </div>
          <div className={styles.addButton} onClick={handleAdd}>
            + Thêm lịch hẹn
          </div>

        </div>
        <p>Đang tải ...</p>
      </div>
    )
  }

  return (
    
    <div className={styles.page}>
      <div className={styles.header}>

        <div className={styles.headerTitle}>
          <div className={styles.iconWrapper}>
            <FaCalendar /> <p>Quản lý đặt lịch</p>
          </div>

        </div>
        <div className={styles.addButton} onClick={handleAdd}>
          + Thêm lịch hẹn
        </div>
      </div>
      <AppointmentsTable appointments={filteredAppointments} onDelete={handleDelete} onEdit={handleEdit} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAppointment ? 'Chỉnh sửa lịch hẹn' : 'Thêm đặt lịch'} >
        <AppointmentForm initialData={currentAppointment || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  )
}

export default AppointmentList;
