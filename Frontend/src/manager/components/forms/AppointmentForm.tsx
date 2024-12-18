// src/manager/components/forms/AppointmentForm.tsx
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './AppointmentForm.module.css';
import { Branch, Customer, Employee, Feedback, Service } from '../../utils/types';
import { FaPlus } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { DatePicker } from 'rsuite';
import { fetchEmployeeByBranch } from '../../services/employeeService';
import { fetchBranches } from '../../services/branchService';
import { fetchServices } from '../../services/serviceService';

interface AppointmentFormProps {
  initialData?: {
    id: number;
    title: string;
    date: string;
    start_time: string;
    estimated_end_time: string;
    final_price: number;
    status: string;
    customer: Customer;
    service: Service;
    branch: Branch;
    feedback: Feedback | null;
    employee?: Employee | null;
    created_at: string;
    updated_at: string;
    // Thêm các trường cần thiết
  };
  onSubmit: (data: any) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onSubmit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [start_time, setStart_time] = useState(initialData?.start_time || '');
  const [estimated_end_time, setEstimated_end_time] = useState(initialData?.estimated_end_time || '');
  const [final_price, setFinal_price] = useState(initialData?.final_price || 0);
  const [status, setStatus] = useState(initialData?.status || '');
  const [customer, setCustomer] = useState<Customer>(initialData?.customer || {} as Customer);
  const [service, setService] = useState<Service>(initialData?.service || {} as Service);
  const [branch, setBranch] = useState<Branch>(initialData?.branch || {} as Branch);
  const [employee, setEmployee] = useState<Employee>(initialData?.employee || {} as Employee);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [rightSection, setRightSection] = useState<'employee' | 'service' | 'branch' | 'voucher' | 'time'>('branch');

  const [searchTerm, setSearchTerm] = useState('');
  const [isInvalidEmployeeErrorMessage, setIsInvalidEmployeeErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadBranches = async () => {
      const branchesData = await fetchBranches();
      setBranches(branchesData);
    };
    loadBranches();
  }, [branch]);
  
  useEffect(() => {
    const loadEmployees = async () => {
      const employeeData = await fetchEmployeeByBranch(branch.id);
      setEmployees(employeeData);
    };
    loadEmployees();
  }, [branch]);

  useEffect(() => {
    const loadServices = async () => {
      const serviceData = await fetchServices();
      setServices(serviceData);
    };
    loadServices();
  }, []);

  useEffect(() => {
    if (rightSection === 'employee' && !service.id) {
      setIsInvalidEmployeeErrorMessage('Please select an employee');
    } 
    else if (rightSection === 'service' && !branch.id) {
      setIsInvalidEmployeeErrorMessage('Please select a service');
    }
    else if (rightSection === 'branch' && !branch.id) {
      setIsInvalidEmployeeErrorMessage('Please select a branch');
    } else {
      setIsInvalidEmployeeErrorMessage(null);
      renderRightSection();
    }
  }, [rightSection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { title, date, start_time, estimated_end_time, final_price, status, customer, service, branch, employee };
    onSubmit(data);
  };

  const handleSearch = () => {

  } 

  const renderRightSection = () => {
    switch (rightSection) {
      case 'employee':
        return employeeList();
      case 'service':
        return serviceList();
      case 'branch':
        return branchList();
      default:
        return null;
    }
  }

  const employeeList = () => {
    return employees.filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase())).map((employee) => (
      <li key={employee.id} onClick={() => setEmployee(employee)}>
        {employee.name}
      </li>
    ));
  }

  const serviceList = () => {
    return services.filter((service) => service.title.toLowerCase().includes(searchTerm.toLowerCase())).map((service) => (
      <li key={service.id} onClick={() => setService(service)}>
        {service.title}
        <span>{service.price}</span>
      </li>
    ));
  }

  const branchList = () => {
    return branches.filter((branch) => branch.name.toLowerCase().includes(searchTerm.toLowerCase())).map((branch) => (
      <li key={branch.id} onClick={() => setBranch(branch)}>
        {branch.name}
        <span>{branch.address}</span>
      </li>
    ));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.AppointmentForm}
      onError={() => {}}
    >
      <div className={styles.container}>
        {/* Left: */}
        <div className={styles.leftSection}>
          <div className={styles.branchButton}
          onClick={() => setRightSection('branch')}
          >
            <h3 style={{ fontWeight: "bold" }}>{branch ? branch.name : 'Chọn chi nhánh'}</h3>
          </div>
          <div className={styles.branchButton}
          onClick={() => setRightSection('service')}
          >
            <h3 style={{ fontWeight: "bold" }}>{service ? service.title : 'Chọn chi nhánh'}</h3>
          </div>
          <div className={styles.branchButton}
          onClick={() => setRightSection('employee')}
          >
            <h3 style={{ fontWeight: "bold" }}>{employee ? employee.name : 'Chọn chi nhánh'}</h3>
          </div>
        </div>
        

        {/* Right: Employee List with Search */}
        <div className={styles.rightSection}>
          <div className={styles.stickySearchBar}>
            <Input
              label="Search employees"
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchBar}
            />
          </div>
          {isInvalidEmployeeErrorMessage && (
            <p style={{ color: "red" }}>{isInvalidEmployeeErrorMessage}</p>
          )}
          <ul className={styles.rightSectionList}>
            {renderRightSection()}
          </ul>
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default AppointmentForm;
