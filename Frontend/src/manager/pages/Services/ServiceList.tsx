// src/manager/pages/Services/ServiceList.tsx
import React, { useEffect, useState } from 'react';
import ServicesTable from '../../components/tables/ServicesTable';
import styles from '../../components/common/global.module.css';
import Modal from '../../components/common/Modal';
import ModalWaiting from '../../components/common/ModalWaiting';

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
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isModalWaitingOpen, setIsModalWaitingOpen] = useState<boolean>(false);

  const [currentService, setCurrentService] = useState<Service | null>(null); 
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(10);

  const [filterTerm, setFilterTerm] = useState('');
  
  const [historyItems, setHistoryItems] = useState<Array<{
    id: number,
    message: string,
    type: string,
  }>>([]);
  
  const addHistoryItem = (message: string, type: string) => {
    const newItem = {
      id: Date.now(),
      message,
      type
    };
    setHistoryItems(prev => [...prev, newItem]);
    setTimeout(() => {
      setHistoryItems(prev => prev.filter(item => item.id !== newItem.id));
    }, 5000);
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

  
  const handleDelete = (service: Service) => {
    setCurrentService(service);
    setIsModalDeleteOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async (id: number) => {
    try {
      await removeService(id);
      setServices(services.filter((service) => service.id !== id));
      addHistoryItem(`Đã xóa ${currentService?.title}`, 'deleted');
    } catch (err) {
      setError('Failed to delete service.');
    }
    setIsModalDeleteOpen(false);
  };
  const handleFormSubmit = async (data: any) => {
    try {
      setIsModalWaitingOpen(true);
      if (currentService) {
        // Edit service
        const editdService = await editService(currentService.id, data);
        console.log(editdService);
        setServices(
          services.map((service) => (service.id === editdService.id ? editdService : service))
        );
        addHistoryItem(`Đã cập nhật ${data.title}`, 'edited');
      } else {
        // Add service
        const newService = await addService(data);
        setServices([...services, newService]);
        addHistoryItem(`Đã thêm ${data.title}`, 'added');
      }
      setIsModalOpen(false);
      setIsModalWaitingOpen(false);
    } catch (err) {
      setError('Failed to save service.');
      addHistoryItem(`Đã có lỗi khi thao tác.`,'error');
      setIsModalWaitingOpen(false);
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
            <input
              className={styles.searchInput}
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
      >
        <ServiceForm initialData={currentService || undefined} onSubmit={handleFormSubmit} type={currentService ? 'Xác nhận Sửa' : 'Xác nhận Thêm'} />
      </Modal>
    );
  }
  const renderDeleteModal = () => {
    return (
      <Modal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        title="Xác nhận xóa dịch vụ"
      >
        <div className={styles.modalActions}>
          <button onClick={() => currentService && handleDeleteConfirm(currentService.id)}>Xóa</button>
        </div>
      </Modal>
    );
  }
  const renderWaitingModal = () => {
    return(
      <ModalWaiting isOpen={isModalWaitingOpen}/>
    )
  }
  const renderHistory = () => {
    return (
      <div className={styles.historyContainer}>
        {historyItems.map((item) => {
          if (item.type === 'error') {
            return (
              <div key={item.id} className={styles.historyItemError}>
                <span>{item.message}</span>
                <div 
                  className={styles.progressBarError} 
                />
              </div>
            );
          }
          return (
            <div key={item.id} className={styles.historyItem}>
              <span>{item.message}</span>
              <div 
                className={styles.progressBar} 
              />
            </div>
          );
        })}
      </div>
    );
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
        <ModalWaiting isOpen={loading}/>  
      </div>
    );
  }
  return (
    <div className={styles.page}>
      {renderHeader()}
      {renderPageSelect()}
      {renderEditModal()}
      {renderWaitingModal()}
      {renderDeleteModal()}
      {renderTable()}
      {renderHistory()}
    </div>
  );
};

export default ServiceList;
