// src/manager/pages/Accounts/AccountList.tsx
import React, { useEffect, useState } from 'react';
import AccountsTable from '../../components/tables/AccountsTable';
import { FaUsers } from 'react-icons/fa6';
import Modal from '../../components/common/Modal';
import AccountForm from '../../components/forms/AccountForm';
import styles from './AccountList.module.css';
import { fetchAccounts, removeAccount, addAccount, editAccount } from '../../services/accountService';

import { Account } from '../../utils/types';

const Role = {
  Admin: 'admin',
  Manager: 'manager',
  Customer: 'customer',
};

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null); // null cho Add, account cụ thể cho Edit

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await removeAccount(id);
        setAccounts(accounts.filter((account) => account.id !== id));
      } catch (err) {
        setError('Failed to delete account.');
      }
    }
  };

  const handleAdd = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentAccount) {
        // Edit account
        const editdAccount = await editAccount(currentAccount.id, data);
        setAccounts(
          accounts.map((account) => (account.id === editdAccount.id ? { ...account, ...editdAccount } : account))
        );
      } else {
        // Add account
        const newAccount = await addAccount(data);
        setAccounts([...accounts, newAccount]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save account.');
    }
  };



  // if (loading) {
  //   return <p>Đang tải...</p>;
  // }

  // return (
    
  //   <div className={styles.accountList}>
  //     <h2>Danh sách tài khoản</h2>
  //     <div className={styles.actions}>
  //       <Button onClick={handleAdd}>Thêm tài khoản</Button>
  //       <Input
  //         label=""
  //         type="text"
  //         placeholder="Tìm kiếm tài khoản..."
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //         className={styles.searchInput}
  //       />
  //     </div>
  //     {error && <p className={styles.error}>{error}</p>}
      
  //     <AccountsTable accounts={accounts} onDelete={handleDelete} onEdit={handleEdit} />
  //     {/* Modal cho Add/Edit */}
  //     <Modal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //       title={currentAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}
  //     >
  //       <AccountForm initialData={currentAccount || undefined} onSubmit={handleFormSubmit} />
  //     </Modal>
  //   </div>
  // );

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
        <p>Đang tải...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        
          <div className={styles.headerTitle}>
            <div className={styles.iconWrapper}>
              <FaUsers /> <p>Quản lý tài khoản</p>
            </div>

          </div>
          <div className={styles.addButton} onClick={handleAdd}>
            + Thêm nhân viên
          </div>
      </div>
      <AccountsTable accounts={accounts} onDelete={handleDelete} onEdit={handleEdit} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}
      >
        <AccountForm initialData={currentAccount || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};
//
export default AccountList;
