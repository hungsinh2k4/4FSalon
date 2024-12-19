// src/manager/components/forms/AppointmentForm.tsx
import React, { useEffect, useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './AppointmentForm.module.css';
import alternativeStyles from "../tables/AppointmentsTable.module.css"
import { Branch, Customer, Employee, Feedback, Service } from '../../utils/types';
import { DatePicker } from 'rsuite';
import { fetchEmployeeByBranch } from '../../services/employeeService';
import { fetchBranches } from '../../services/branchService';
import { fetchServices } from '../../services/serviceService';
import { Schedule, Voucher } from '../../../customer/utils/types';
import { fetchVoucherbyBranchId } from '../../../customer/services/Booking/VoucherService';
import { beautifyPrice } from '../../../customer/utils/helpers';
import TimePicker from '../../../customer/components/Booking/TimePicker';
import { getEmployeeSchedule } from '../../../customer/api/employees';


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
    voucher: Voucher;
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
  const [date, setDate] = useState(initialData?.date ? new Date(initialData.date) : new Date());
  const [start_time, setStart_time] = useState(initialData?.start_time || null);
  const [estimated_end_time, setEstimated_end_time] = useState(initialData?.estimated_end_time || '');
  const [final_price, setFinal_price] = useState(initialData?.final_price || 0);
  const [status, setStatus] = useState(initialData?.status || '');
  const [customer, setCustomer] = useState<Customer>(initialData?.customer || {} as Customer);
  const [service, setService] = useState<Service>(initialData?.service || {} as Service);
  const [branch, setBranch] = useState<Branch>(initialData?.branch || {} as Branch);
  const [employee, setEmployee] = useState<Employee>(initialData?.employee || {} as Employee);
  const [voucher, setVoucher] = useState<Voucher>(initialData?.voucher || {} as Voucher);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [rightSection, setRightSection] = useState<'employee' | 'service' | 'branch' | 'voucher' | 'time' | "status">('branch');

  const [searchTerm, setSearchTerm] = useState('');
  const [isInvalidEmployeeErrorMessage, setIsInvalidEmployeeErrorMessage] = useState<string | null>(null);

  if (initialData) {
    customer.points += initialData?.voucher?.required_point || 0;
  }

  useEffect(() => {
    const loadVouchers = async () => {
      const voucherData = await fetchVoucherbyBranchId(branch.id);
      setVouchers(Array.isArray(voucherData) ? voucherData : []);
    }
    loadVouchers();
  }, [branch])

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
    } else if (rightSection === 'branch' && !branch.id) {
      setIsInvalidEmployeeErrorMessage('Please select a branch');
    } else {
      setIsInvalidEmployeeErrorMessage(null);
      renderRightSection();
    }
  }, [rightSection]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!branch.id || !service.id || !employee.id || !status || !start_time || !estimated_end_time || !final_price) {
      e.preventDefault();
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    e.preventDefault();

    if (initialData?.status != status) {
      if (initialData?.status == "cancelled") {
        customer.points -= voucher?.required_point || 0;
      }
    }

    if (status != "cancelled") {
      if (initialData?.voucher != voucher) {
        customer.points += initialData?.voucher?.required_point || 0;
        customer.points -= voucher?.required_point || 0;
      }
    }

    customer.points -= initialData?.voucher?.required_point || 0;


    const data = { title, date, start_time, estimated_end_time, final_price, status, voucher, customer, service, branch, employee };
    onSubmit(data);
  };



  const handleSearch = (value: string) => {
    setSearchTerm(value);
  }

  const renderRightSection = () => {
    switch (rightSection) {
      case 'employee':
        return employeeList();
      case 'service':
        return serviceList();
      case 'branch':
        return branchList();
      case 'status':
        return statusList();
      case 'voucher':
        return voucherList();
      case 'time':
        return timeTable();
      default:
        return null;
    }
  }

  useEffect(() => {
    const servicePrice = service?.price ?? 0;
    let voucherDiscount = voucher?.discount_value ?? 0;
    if (voucher?.discount_type === "percentage") {
      voucherDiscount = Math.floor((servicePrice * voucherDiscount) / 100); // Rounds down to the nearest integer
    }
    setFinal_price(servicePrice - voucherDiscount);
  }, [service, voucher]);


  useEffect(() => {
    const loadSchedule = async () => {
      if (!employee?.id) return; // If no ID, do nothing
      try {
        const data = await getEmployeeSchedule(employee?.id, date);
        setSchedule(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err)
      }
    };

    loadSchedule();
  }, [employee, date]);

  const handleTimeSelect = (time: string | null) => {
    if (time) {
      // Tách giờ và phút từ selectedTime
      const [hours, minutes] = time?.split(":").map(Number);

      // Tạo đối tượng Date từ selectedDate và selectedTime
      const startDateTime = date;
      startDateTime?.setHours(hours, minutes, 0, 0); // Cập nhật giờ, phút
      if (startDateTime) {
        setEstimated_end_time(new Date(startDateTime?.getTime() + service.estimate_time * 60000).toISOString());
      }
      setStart_time(startDateTime?.toISOString() || null);
    }
  };



  const timeTable = () => {
    if (employee.id == null) {
      return <li onClick={() => {
        setRightSection("employee");
      }} style={{ color: "red" }}>Vui lòng chọn nhân viên trước</li>
    }
    return <>

      <DatePicker
        value={date}
        onChange={(value) => {
          if (value != null) {
            setDate(value || undefined);
          } else {
            setError("Vui lòng chọn ngày hợp lệ");
          }
        }}
        defaultValue={new Date()}
        style={{ width: "50%" }}
        placeholder="Chọn ngày"
        placement="auto"
      />
      <p style={{ marginTop: "10px", marginBottom: "10px" }}>
        Ngày được chọn:{" "}
        {date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) : 'Invalid date'}
      </p>


      <TimePicker
        timeBlock={Math.floor(Number(service?.estimate_time) / 20)}
        onTimeSelect={handleTimeSelect}
        schedule={schedule}
        selectedDate={date}
        isDisplaying={employee == null ? false : true}
        setErrorTime={setError}
      />
    </>
  }



  const isVoucherValid = (voucher: Voucher): boolean => {
    if (date === undefined) return false; // Nếu không có ngày thì không hợp lệ
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);
    const isDateInRange = date >= startDate && date <= endDate; // Sử dụng selectedDate
    const isPriceValid = (service?.price ?? 0) >= voucher.price_threshold;
    const isPointsValid = (Number(customer?.points) >= voucher.required_point);

    return isDateInRange && isPriceValid && isPointsValid;
  };

  const voucherList = () => {
    if (vouchers.length === 0) {
      return <li onClick={() => {
        setRightSection("branch");
      }} style={{ color: "red" }}>Vui lòng chọn chi nhánh trước</li>
    }
    return vouchers.filter((voucher) => voucher.code.toLowerCase().includes(searchTerm.toLowerCase())).map((voucher) => (
      <li
        key={voucher.id}
        onClick={() => service.price >= voucher.price_threshold && setVoucher(voucher)}
        className={isVoucherValid(voucher) ? styles.disabled : ''}
        aria-disabled={isVoucherValid(voucher)}
      >
        {voucher.code}
        <span>
          {voucher.discount_type === 'percentage'
            ? `${voucher.discount_value}%`
            : `${beautifyPrice(voucher.discount_value)}`}
        </span>
      </li>

    ));
  }

  const statusList = () => {
    return <>
      <ul className={alternativeStyles.confirmed} key={"comfirmed"} onClick={() => setStatus("confirmed")}>
        {"Confirm"}
      </ul>
      <ul className={alternativeStyles.cancelled} key={"cancelled"} onClick={() => setStatus("cancelled")}>
        {"Cancelled"}
      </ul>
      <ul className={alternativeStyles.completed} key={"completed"} onClick={() => setStatus("completed")}>
        {"Completed"}
      </ul>
      <ul className={alternativeStyles.pending} key={"pending"} onClick={() => setStatus("pending")}>
        {"Pending"}
      </ul>
    </>
  }

  const employeeList = () => {
    if (employees.length === 0) {
      return <li onClick={() => {
        setRightSection("branch");
      }} style={{ color: "red" }}>Vui lòng chọn chi nhánh trước</li>
    }
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
        <span>{beautifyPrice(service.price)}</span>
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
      onError={() => { }}
    >
      <span style={{ color: "red" }}>{error}</span>
      <div className={styles.container}>
        {/* Left: */}
        <div className={styles.leftSection}>
          <div className={styles.label}>
            <label htmlFor="branch">Chi nhánh</label>
          </div>
          <div
            id="branch"
            className={styles.branchButton}
            onClick={() => setRightSection('branch')}
          >
            <h3 style={{ fontWeight: "bold" }}>{branch.name != null ? branch.name : 'Chọn chi nhánh'}</h3>
          </div>

          <div className={styles.label}>
            <label htmlFor="service">Dịch vụ</label>
          </div>
          <div
            id="service"
            className={styles.branchButton}
            onClick={() => setRightSection('service')}
          >
            <h3 style={{ fontWeight: "bold" }}>{service.title != null ? service.title : 'Chọn dịch vụ'}</h3>
          </div>

          <div className={styles.label}>
            <label htmlFor="employee">Nhân viên</label>
          </div>
          <div
            id="employee"
            className={styles.branchButton}
            onClick={() => setRightSection('employee')}
          >
            <h3 style={{ fontWeight: "bold" }}>{employee.name != null ? employee.name : 'Chọn nhân viên'}</h3>
          </div>

          <div className={styles.label}>
            <label htmlFor="status">Trạng thái</label>
          </div>
          <div
            id="status"
            className={styles.branchButton}
            onClick={() => setRightSection('status')}
          >
            <h3 style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {status ? status : 'Chọn trạng thái'}
            </h3>
          </div>


          <div className={styles.label}>
            <label htmlFor="time">Thời gian</label>
          </div>
          <div
            id="time"
            className={styles.branchButton}
            onClick={() => setRightSection('time')}
          >
            <h3 style={{ fontWeight: "bold" }}>
              {start_time ? new Date(start_time).toLocaleString() : 'Chọn thời gian'}
            </h3>
          </div>

          <div className={styles.label}>
            <label htmlFor="voucher">Voucher</label>
          </div>
          <div
            id="voucher"
            className={styles.branchButton}
            onClick={() => setRightSection('voucher')}
          >
            <h3 style={{ fontWeight: "bold" }}>
              {voucher.code != null ? voucher.code : 'Chọn voucher'}
            </h3>
          </div>

          <p className="pt-3 text-green-700	">
            Tổng thanh toán:{" "}
            {service
              ? beautifyPrice(final_price)
              : 0}
          </p>

        </div>


        {/* Right: Employee List with Search */}
        <div className={styles.rightSection}>
          <div className={styles.stickySearchBar}>
            <Input
              label="Search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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
