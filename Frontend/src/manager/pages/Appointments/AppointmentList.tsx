// src/manager/pages/Appointments/AppointmentList.tsx
import React, { useEffect, useState } from 'react';
import AppointmentsTable from '../../components/tables/AppointmentsTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';
import styles from '../../components/common/global.module.css';
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

  const [searchName, setSearchName] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchService, setSearchService] = useState<string>('');

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null); // null cho Add, appointment cụ thể cho Edit
  
  const [page, setPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(10);

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
  
    appointment.customer.name.toLowerCase().includes(searchName.toLowerCase()) &&
    appointment.status.toLowerCase().includes(searchStatus.toLowerCase()) &&
    appointment.service.title.toLowerCase().includes(searchService.toLowerCase())
  );
  const handleSetPage = (page: number) => {
    setPage(page);
  }
  const handleSetRowPerPage = (number: number) => {
    setRowPerPage(number);
    setPage(1)
  }
  const handleNextPage = () => {
    setPage(page + 1);
  }
  const handlePrevPage = () => {
    setPage(page - 1);
  }
  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredAppointments.length / rowPerPage);
    let startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
    if (page <= 3) startPage = 1;
  
    return [...Array(Math.min(5, totalPages - startPage + 1))].map((_, index) => {
      const pageNumber = startPage + index;
      return (
        <button 
          key={pageNumber}
          onClick={() => handleSetPage(pageNumber)}
          className={page === pageNumber ? styles.activePage : ''}
        >
          {pageNumber}
        </button>
      );
    });
  };
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.iconWrapper}>
          <FaCalendar /> <p>Quản lý lịch hẹn</p>
          </div>
        </div>
        
      </div>
    );
  };
  const renderPageSelect = () => {
    return (
      <><div className={styles.selectPage}>
        <select value={rowPerPage} onChange={(e) => handleSetRowPerPage(Number(e.target.value))} className={styles.rowPerPage}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>
          Showing {(page - 1) * rowPerPage + 1} - {Math.min(page * rowPerPage, filteredAppointments.length)} of {filteredAppointments.length} entries
        </span>
      </div>
      <div className={styles.allPage}>
        <button onClick={() => handlePrevPage()} disabled={page === 1}> Previous </button>
        {renderPaginationButtons()}
        <button onClick={() => handleNextPage()} disabled={page >= Math.ceil(filteredAppointments.length / rowPerPage)}> Next </button>
        <div className={styles.searchField}>
          🔎
          <div>
            <input
              className={styles.searchInput}
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Khách hàng"
            />
          </div>
          <select 
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            required={true}  
          >
            <option value=''>Tất cả</option>
            <option value='pending'>Đang chờ</option>
            <option value='confirmed'>Đã xác nhận</option>
            <option value='completed'>Đã hoàn thành</option>
            <option value='cancelled'>Đã hủy</option>
          </select>
        </div>
        
        
        <div className={styles.addButton} onClick={handleAdd}>
            + Thêm lịch hẹn
        </div>
        
      </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>

          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper}>
              <FaCalendar /> <p>Quản lý lịch hẹn</p>
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
      {renderHeader()}
      {renderPageSelect()}
      <AppointmentsTable appointments={filteredAppointments} onDelete={handleDelete} onEdit={handleEdit} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAppointment ? 'Chỉnh sửa lịch hẹn' : 'Thêm lịch hẹn'} >
        <AppointmentForm initialData={currentAppointment || undefined} onSubmit={handleFormSubmit} type={currentAppointment ? 'Chỉnh sửa lịch hẹn' : 'Thêm lịch hẹn'} />
      </Modal>
    </div>
  )
}

export default AppointmentList;
