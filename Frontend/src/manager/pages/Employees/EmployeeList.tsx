// src/manager/pages/Employees/EmployeeList.tsx
import React, { useEffect, useState } from 'react';
import EmployeesTable from '../../components/tables/EmployeesTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import EmployeeForm from '../../components/forms/EmployeeForm';
import styles from './EmployeeList.module.css';
import { fetchEmployees, removeEmployee, addEmployee, editEmployee } from '../../services/employeeService';

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  // Thêm các trường khác nếu cần
}

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
        await removeEmployee(id);
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
      } else {
        // Add employee
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
    return <p>Đang tải...</p>;
  }

  return (
    <div className={styles.employeeList}>
      <h2>Danh sách nhân viên</h2>
      <div className={styles.actions}>
        <Button onClick={handleAdd}>Thêm nhân viên</Button>
        <Input
          label=""
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <EmployeesTable employees={filteredEmployees} onDelete={handleDelete} onEdit={handleEdit} />
      
      {/* Modal cho Add/Edit */}
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
