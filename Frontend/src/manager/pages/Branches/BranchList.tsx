// src/manager/pages/Branches/BranchList.tsx
import React, { useEffect, useState } from 'react';
import BranchesTable from '../../components/tables/BranchesTable';
import styles from '../../components/common/global.module.css';
import Modal from '../../components/common/Modal';
import ModalWaiting from '../../components/common/ModalWaiting';

import BranchForm from '../../components/forms/BranchForm';
import { fetchBranches, removeBranch, addBranch, editBranch } from '../../services/branchService';
import { Branch } from '../../utils/types';
import { FaBagShopping } from 'react-icons/fa6';

const BranchList: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isModalWaitingOpen, setIsModalWaitingOpen] = useState<boolean>(false);

  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null); 
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

  
  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );
  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      try {
        const data = await fetchBranches();
        const reformattedData = data.map((branch: any) => ({
          ...branch,
          created_at: new Date(branch.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
        }));
        setBranches(reformattedData);
      } catch (err) {
        setError('Failed to fetch branches.');
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, []);

  
  const handleDelete = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsModalDeleteOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async (id: number) => {
    try {
      await removeBranch(id);
      setBranches(branches.filter((branch) => branch.id !== id));
      addHistoryItem(`Đã xóa ${currentBranch?.name}`, 'deleted');
    } catch (err) {
      setError('Failed to delete branch.');
    }
    setIsModalDeleteOpen(false);
  };
  const handleFormSubmit = async (data: any) => {
    try {
      setIsModalWaitingOpen(true);
      if (currentBranch) {
        // Edit branch
        const editdBranch = await editBranch(currentBranch.id, data);
        setBranches(
          branches.map((branch) => (branch.id === editdBranch.id ? editdBranch : branch))
        );
        addHistoryItem(`Đã cập nhật ${data.name}`, 'edited');
      } else {
        // Add branch
        const newBranch = await addBranch(data);
        setBranches([...branches, newBranch]);
        addHistoryItem(`Đã thêm ${data.name}`, 'added');
      }
      setIsModalOpen(false);
      setIsModalWaitingOpen(false);
    } catch (err) {
      setError('Failed to save branch.');
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
    const totalPages = Math.ceil(filteredBranches.length / rowPerPage);
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
            <FaBagShopping /> <p>Quản lý chi nhánh</p>
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
          Showing {(page - 1) * rowPerPage + 1} - {Math.min(page * rowPerPage, filteredBranches.length)} of {filteredBranches.length} entries
        </span>
      </div>
      <div className={styles.allPage}>
        <button onClick={() => handlePrevPage()} disabled={page === 1}> Previous </button>
        {renderPaginationButtons()}
        <button onClick={() => handleNextPage()} disabled={page >= Math.ceil(filteredBranches.length / rowPerPage)}> Next </button>
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
            + Thêm chi nhánh
        </div>
        
      </div>
      </>
    )
  }
  const renderTable = () => {
    return (
      <BranchesTable 
        branches={filteredBranches.slice(page*rowPerPage-rowPerPage, page*rowPerPage)} 
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
        title={currentBranch ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh'}
      >
        <BranchForm initialData={currentBranch || undefined} onSubmit={handleFormSubmit} type={currentBranch ? 'Xác nhận Sửa' : 'Xác nhận Thêm'} />
      </Modal>
    );
  }
  const renderDeleteModal = () => {
    return (
      <Modal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        title="Xác nhận xóa chi nhánh"
      >
        <div className={styles.modalActions}>
          <button onClick={() => currentBranch && handleDeleteConfirm(currentBranch.id)}>Xóa</button>
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

export default BranchList;
