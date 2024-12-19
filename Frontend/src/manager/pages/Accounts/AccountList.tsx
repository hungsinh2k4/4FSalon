// src/manager/pages/Accounts/AccountList.tsx
import React, { useEffect, useState } from 'react';
import AccountsTable from '../../components/tables/AccountsTable';
import styles from '../../components/common/global.module.css';
import Modal from '../../components/common/Modal';
import ModalWaiting from '../../components/common/ModalWaiting';
import { FaUsers } from 'react-icons/fa6';
import AccountForm from '../../components/forms/AccountForm';
import { fetchAccounts, removeAccount, addAccount, editAccount } from '../../services/accountService';
import { Account } from '../../utils/types';

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isModalWaitingOpen, setIsModalWaitingOpen] = useState<boolean>(false);

  const [currentAccount, setCurrentAccount] = useState<Account | null>(null); 
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

  
  const filteredAccounts = accounts.filter(account =>
    account.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    account.role.toString().includes(filterTerm)
  );
  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        const data = await fetchAccounts();
        const reformattedData = data.map((account: any) => ({
          ...account,
          created_at: new Date(account.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
        }));
        setAccounts(reformattedData);
      } catch (err) {
        setError('Failed to fetch accounts.');
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  
  const handleDelete = (account: Account) => {
    setCurrentAccount(account);
    setIsModalDeleteOpen(true);
  };
  
  const handleAdd = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };
  const handleDeleteConfirm = async (id: number) => {
    try {
      await removeAccount(id);
      setAccounts(accounts.filter((account) => account.id !== id));
      addHistoryItem(`Đã xóa ${currentAccount?.email}`, 'deleted');
    } catch (err) {
      setError('Failed to delete account.');
    }
    setIsModalDeleteOpen(false);
  };
  const handleFormSubmit = async (data: any) => {
    try {
      setIsModalWaitingOpen(true);
      if (currentAccount) {
        // Edit account
        const editdAccount = await editAccount(currentAccount.id, data);
        setAccounts(
          accounts.map((account) => (account.id === editdAccount.id ? editdAccount : account))
        );
        addHistoryItem(`Đã cập nhật ${data.email}`, 'edited');
      } else {
        // Add account
        const newAccount = await addAccount(data);
        setAccounts([...accounts, newAccount]);
        addHistoryItem(`Đã thêm ${data.email}`, 'added');
      }
      setIsModalOpen(false);
      setIsModalWaitingOpen(false);
    } catch (err) {
      setError('Failed to save account.');
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
    const totalPages = Math.ceil(filteredAccounts.length / rowPerPage);
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
            <FaUsers /> <p>Quản lý tài khoản</p>
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
          Showing {(page - 1) * rowPerPage + 1} - {Math.min(page * rowPerPage, filteredAccounts.length)} of {filteredAccounts.length} entries
        </span>
      </div>
      <div className={styles.allPage}>
        <button onClick={() => handlePrevPage()} disabled={page === 1}> Previous </button>
        {renderPaginationButtons()}
        <button onClick={() => handleNextPage()} disabled={page >= Math.ceil(filteredAccounts.length / rowPerPage)}> Next </button>
        <div className={styles.searchField}>
          <div>
            <input
              className={styles.searchInput}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập email tài khoản"
            />
          </div>
        </div>
        <div className={styles.addButton} onClick={handleAdd}>
            + Thêm tài khoản
        </div>
        
      </div>
      </>
    )
  }
  const renderTable = () => {
    return (
      <AccountsTable 
        accounts={filteredAccounts.slice(page*rowPerPage-rowPerPage, page*rowPerPage)} 
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
        title={currentAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}
      >
        <AccountForm initialData={currentAccount || undefined} onSubmit={handleFormSubmit} type={currentAccount ? 'Xác nhận Sửa' : 'Xác nhận Thêm'} />
      </Modal>
    );
  }
  const renderDeleteModal = () => {
    return (
      <Modal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        title="Xác nhận xóa tài khoản"
      >
        <div className={styles.modalActions}>
          <button onClick={() => currentAccount && handleDeleteConfirm(currentAccount.id)}>Xóa</button>
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
                <FaUsers /> <p>Quản lý tài khoản</p>
              </div>
  
            </div>
            <div className={styles.addButton} onClick={handleAdd}>
              + Thêm tài khoản
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

export default AccountList;
