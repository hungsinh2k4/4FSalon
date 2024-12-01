// src/manager/pages/Employees/EmployeeList.tsx
import React, { useEffect, useState } from 'react';
import EmployeesTable from '../../components/tables/EmployeesTable';
import styles from '../../components/common/global.module.css';
import Modal from '../../components/common/Modal';
import ModalWaiting from '../../components/common/ModalWaiting';
import EmployeeForm from '../../components/forms/EmployeeForm';
import { fetchEmployees, removeEmployee, addEmployee, editEmployee } from '../../services/employeeService';
import { Employee } from '../../utils/types';
import { FaUsers } from 'react-icons/fa6';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isModalWaitingOpen, setIsModalWaitingOpen] = useState<boolean>(false);

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null); 
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

  
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to fetch employees.');
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  
  const handleDelete = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalDeleteOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async (id: number) => {
    try {
      await removeEmployee(id);
      setEmployees(employees.filter((employee) => employee.id !== id));
      addHistoryItem(`Đã xóa ${currentEmployee?.name}`, 'deleted');
    } catch (err) {
      setError('Failed to delete employee.');
    }
    setIsModalDeleteOpen(false);
  };
  const handleFormSubmit = async (data: any) => {
    try {
      setIsModalWaitingOpen(true);
      if (currentEmployee) {
        // Edit employee
        const editdEmployee = await editEmployee(currentEmployee.id, data);
        setEmployees(
          employees.map((employee) => (employee.id === editdEmployee.id ? editdEmployee : employee))
        );
        addHistoryItem(`Đã cập nhật ${data.name}`, 'edited');
      } else {
        // Add employee
        const newEmployee = await addEmployee(data);
        setEmployees([...employees, newEmployee]);
        addHistoryItem(`Đã thêm ${data.name}`, 'added');
      }
      setIsModalOpen(false);
      setIsModalWaitingOpen(false);
    } catch (err) {
      setError('Failed to save employee.');
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
    const totalPages = Math.ceil(filteredEmployees.length / rowPerPage);
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
            <FaUsers /> <p>Quản lý nhân viên</p>
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
          Showing {(page - 1) * rowPerPage + 1} - {Math.min(page * rowPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
        </span>
      </div>
      <div className={styles.allPage}>
        <button onClick={() => handlePrevPage()} disabled={page === 1}> Previous </button>
        {renderPaginationButtons()}
        <button onClick={() => handleNextPage()} disabled={page >= Math.ceil(filteredEmployees.length / rowPerPage)}> Next </button>
        <div className={styles.searchField}>
          <div>
            <input
              className={styles.searchInput}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên nhân viên"
            />
          </div>
        </div>
        <div className={styles.addButton} onClick={handleAdd}>
            + Thêm nhân viên
        </div>
        
      </div>
      </>
    )
  }
  const renderTable = () => {
    return (
      <EmployeesTable 
        employees={filteredEmployees.slice(page*rowPerPage-rowPerPage, page*rowPerPage)} 
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
        title={currentEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
      >
        <EmployeeForm initialData={currentEmployee || undefined} onSubmit={handleFormSubmit} type={currentEmployee ? 'Xác nhận Sửa' : 'Xác nhận Thêm'} />
      </Modal>
    );
  }
  const renderDeleteModal = () => {
    return (
      <Modal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        title="Xác nhận xóa nhân viên"
      >
        <div className={styles.modalActions}>
          <button onClick={() => currentEmployee && handleDeleteConfirm(currentEmployee.id)}>Xóa</button>
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
                <FaUsers /> <p>Quản lý nhân viên</p>
              </div>
  
            </div>
            <div className={styles.addButton} onClick={handleAdd}>
              + Thêm nhân viên
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

export default EmployeeList;
