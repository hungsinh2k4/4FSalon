// src/manager/pages/Services/ServiceList.tsx
import React, { useEffect, useState } from 'react';
import ServicesTable from '../../components/tables/ServicesTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ServiceForm from '../../components/forms/ServiceForm';
import styles from './ServiceList.module.css';
import { fetchServices, removeService, addService, editService } from '../../services/serviceService';

interface Service {
  id: number;
  name: string;
  price: number;
  estimatedTime: string;
  // Thêm các trường khác nếu cần
}

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
        setServices(data);
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

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className={styles.serviceList}>
      <h2>Danh sách dịch vụ</h2>
      <div className={styles.actions}>
        <Button onClick={handleAdd}>Thêm dịch vụ</Button>
        <Input
          label=""
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <ServicesTable services={filteredServices} onDelete={handleDelete} onEdit={handleEdit} />
      
      {/* Modal cho Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
      >
        <ServiceForm initialData={currentService || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default ServiceList;
