// src/manager/pages/Branches/BranchList.tsx
import React, { useEffect, useState } from 'react';
import BranchesTable from '../../components/tables/BranchesTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import BranchForm from '../../components/forms/BranchForm';
import styles from './BranchList.module.css';
import { fetchBranches, removeBranch, addBranch, editBranch } from '../../services/branchService';
import { Branch } from '../../utils/types';
import { FaUsers } from 'react-icons/fa6';


const BranchList: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null); // null cho Add, branch cụ thể cho Edit

  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      try {
        const data = await fetchBranches();
        setBranches(data);
        console.log(data);
      } catch (err) {
        setError('Failed to fetch branches.');
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chi nhánh này?')) {
      try {
        await removeBranch(id);
        setBranches(branches.filter((branch) => branch.id !== id));
      } catch (err) {
        setError('Failed to delete branch.');
      }
    }
  };

  const handleAdd = () => {
    setCurrentBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentBranch) {
        // Edit branch
        const editdBranch = await editBranch(currentBranch.id, data);
        setBranches(
          branches.map((branch) => (branch.id === editdBranch.id ? editdBranch : branch))
        );
      } else {
        // Add branch
        const newBranch = await addBranch(data);
        setBranches([...branches, newBranch]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save branch.');
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (loading) {
  //   return <p>Đang tải...</p>;
  // }

  // return (
  //   <div className={styles.branchList}>
  //     <h2>Danh sách chi nhánh</h2>
  //     <div className={styles.actions}>
  //       <Button onClick={handleAdd}>Thêm chi nhánh</Button>
  //       <Input
  //         label=""
  //         type="text"
  //         placeholder="Tìm kiếm chi nhánh..."
  //         value={searchTerm}
  //         onChange={(e) => setSearchTerm(e.target.value)}
  //         className={styles.searchInput}
  //       />
  //     </div>
  //     {error && <p className={styles.error}>{error}</p>}
  //     <BranchesTable branches={filteredBranches} onDelete={handleDelete} onEdit={handleEdit} />
      
  //     {/* Modal cho Add/Edit */}
  //     <Modal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //       title={currentBranch ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh'}
  //     >
  //       <BranchForm initialData={currentBranch || undefined} onSubmit={handleFormSubmit} />
  //     </Modal>
  //   </div>
  // );


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
              + Thêm chi nhánh
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
              <FaUsers /> <p>Quản lý chi nhánh</p>
            </div>

          </div>
          <div className={styles.addButton} onClick={handleAdd}>
            + Thêm 
          </div>
      </div>
      <BranchesTable branches={filteredBranches} onDelete={handleDelete} onEdit={handleEdit} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBranch ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh'}
      >
        <BranchForm initialData={currentBranch || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default BranchList;
