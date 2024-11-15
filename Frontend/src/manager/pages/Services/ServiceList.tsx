// src/manager/pages/Services/ServiceList.tsx
import React, { useEffect, useState } from 'react';
import ServicesTable from '../../components/tables/ServicesTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ServiceForm from '../../components/forms/ServiceForm';
import styles from './ServiceList.module.css';
import { fetchServices, removeService, addService, editService } from '../../services/serviceService';
import { Service } from '../../utils/types';
import { FaBagShopping } from 'react-icons/fa6';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentService, setCurrentService] = useState<Service | null>(null); // null cho Add, service cụ thể cho Edit

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        const reformattedData = data.map((service: any) => ({
          ...service,
          created_at: new Date(service.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
        }));
        setServices(reformattedData);
      } catch (err) {
        setError('Failed to fetch services.');
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await removeService(id);
        setServices(services.filter((service) => service.id !== id));
      } catch (err) {
        setError('Failed to delete service.');
      }
    }
  };

  const handleAdd = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentService) {
        // Edit service
        const editdService = await editService(currentService.id, data);
        setServices(
          services.map((service) => (service.id === editdService.id ? editdService : service))
        );
        console.log("edit thanh cong service",editdService);
      } else {
        // Add service
        const newService = await addService(data);
        setServices([...services, newService]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save service.');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          
            <div className={styles.headerTitle}>
              <div className={styles.iconWrapper}>
                <FaBagShopping /> <p>Quản lý dịch vụ</p>
              </div>
  
            </div>
            <div className={styles.addButton} onClick={handleAdd}>
              + Thêm dịch vụ
            </div>
        </div>
        <p>Đang tải...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        
          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper}>
              <FaBagShopping /> <p>Quản lý dịch vụ</p>
            </div>

          </div>
          <div className={styles.addButton} onClick={handleAdd}>
            + Thêm dịch vụ
          </div>
      </div>
      <ServicesTable services={services} onDelete={handleDelete} onEdit={handleEdit} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentService ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
      >
        <ServiceForm initialData={currentService || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default ServiceList;
