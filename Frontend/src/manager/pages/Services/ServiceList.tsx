// src/manager/pages/Services/ServiceList.tsx
import React, { useEffect, useState } from 'react';
import ServicesTable from '../../components/tables/ServicesTable';
import styles from '../../components/common/global.module.css';
import Modal from '../../components/common/Modal';
import ServiceForm from '../../components/forms/ServiceForm';
import { fetchServices, removeService, addService, editService } from '../../services/serviceService';
import { Service } from '../../utils/types';
import { FaBagShopping, FaFilter } from 'react-icons/fa6';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentService, setCurrentService] = useState<Service | null>(null); 
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(10);

  const [filterTerm, setFilterTerm] = useState('');
  const [sortedField, setSortedField] = useState<{ key: keyof Service; direction: 'asc' | 'desc' }>({ key: 'id', direction: 'asc' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const handleSort = (key: keyof Service) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortedField.key === key && sortedField.direction === 'asc') {
      direction = 'desc';
    }
    setSortedField({ key, direction });
    const sorted = [...services].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      if (valueA === null || valueB === null) return 0;
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setServices(sorted);
  };
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    service.price.toString().includes(filterTerm)
  );
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
    const totalPages = Math.ceil(filteredServices.length / rowPerPage);
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
            <FaBagShopping /> <p>Quản lý dịch vụ</p>
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
          Showing {(page - 1) * rowPerPage + 1} - {Math.min(page * rowPerPage, filteredServices.length)} of {filteredServices.length} entries
        </span>
      </div>
      <div className={styles.allPage}>
        <button onClick={() => handlePrevPage()} disabled={page === 1}> Previous </button>
        {renderPaginationButtons()}
        <button onClick={() => handleNextPage()} disabled={page >= Math.ceil(filteredServices.length / rowPerPage)}> Next </button>
        <div className={styles.searchField}>
          <div>
            <label>Tìm kiếm theo tên:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên dịch vụ"
            />
          </div>
        </div>
        <div className={styles.addButton} onClick={handleAdd}>
            + Thêm dịch vụ
        </div>
        
      </div>
      </>
    )
  }
  const renderTable = () => {
    return (
      <ServicesTable 
        services={filteredServices.slice(page*rowPerPage-rowPerPage, page*rowPerPage)} 
        onDelete={handleDelete} 
        onEdit={handleEdit} 
      />
    );
  }
  const renderEditModal = () => {
    return (
      <>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentService ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
        >
          <ServiceForm initialData={currentService || undefined} onSubmit={handleFormSubmit} type={currentService ? 'Xác nhận Sửa' : 'Xác nhận Thêm'} />
        </Modal>
      </>
    );
  }
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
      {renderHeader()}
      {renderPageSelect()}
      {renderEditModal()}
      {renderTable()}
    </div>
  );
};

export default ServiceList;
