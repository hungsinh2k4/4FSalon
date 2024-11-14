// src/manager/pages/Employees/EmployeeList.tsx
import React, { useEffect, useState } from 'react';
import EmployeesTable from '../../components/tables/EmployeesTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import EmployeeForm from '../../components/forms/EmployeeForm';
import styles from './EmployeeList.module.css';
import { fetchEmployees, removeEmployee, addEmployee, editEmployee } from '../../services/employeeService';
import { Employee } from '../../utils/types';
import { FaUsers } from 'react-icons/fa6';
const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null); // null cho Add, employee cụ thể cho Edit

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        console.log("xoa thang employee",id);
        await removeEmployee(id);
        console.log("xoa thanh cong employee",id);
        setEmployees(employees.filter((employee) => employee.id !== id));
      } catch (err) {
        setError('Failed to delete employee.');
      }
    }
  };

  const handleAdd = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentEmployee) {
        // Edit employee
        const editdEmployee = await editEmployee(currentEmployee.id, data);
        setEmployees(
          employees.map((employee) => (employee.id === editdEmployee.id ? editdEmployee : employee))
        );
        console.log("edit thanh cong employee",editdEmployee);
      } else {
        const newEmployee = await addEmployee(data);
        setEmployees([...employees, newEmployee]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save employee.');
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <p>Đang tải...</p>
      </div>
    );
  }
  
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
      <EmployeesTable employees={filteredEmployees} onDelete={handleDelete} onEdit={handleEdit} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
      >
        <EmployeeForm initialData={currentEmployee || undefined} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default EmployeeList;
