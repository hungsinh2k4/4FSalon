import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCity,
  faLocationDot,
  faScissors,
  faSearch,
  faTicket,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
type Schedule = { start_time: string; estimated_end_time: string }[];

import { Branch, Employee, Service, Voucher, User, Appointment, Customer} from "../utils/types";
import ServiceList from "../components/Booking/ServiceList";
import BranchList from "../components/Booking/BranchList";
import TimePicker from "../components/Booking/TimePicker";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBranches } from "../services/Booking/BookingService";
import { fetchEmployeebyBranchId } from "../services/Booking/employeeService";
import { fetchServices } from "../services/Booking/serviceService";
// import { addBranch } from "../services/Booking/appointment";
import { useAuth } from "../context/AuthContext";
import VoucherList from "../components/Booking/VoucherList";
import { addAppointment } from "../services/Booking/appointment";
import EmployeeList from "../components/Booking/EmployeeList";
import { fetchVoucherbyBranchId } from "../services/Booking/VoucherService";
import { getEmployeeSchedule } from "../api/employees";
import { getUser, getCustomerProfileByUserId } from "../api/user";


const Booking: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState("branches");
  const [stores, setStores] = useState([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [voucher, setVoucher] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedTime, setSelectedTime] = useState<string | null | null>(null);
  const [errorEmployee, setErrorEmployee] = useState<string | null>(null);
  const [errorBranch, setErrorBranch] = useState<string | null>(null);
  const [errorService, setErrorService] = useState<string | null>(null);
  const [errorTime, setErrorTime] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<any | null>(null);
  const { user, setUser } = useAuth();
  const [userprofile, setUserProfile] = useState<User | null>(null);
  const [customerprofile, setCustomerProfile] = useState<Customer | null>(null);
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState<Schedule>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [selectedStartTimeDate, setSelectedStartTimeDate] = useState<Date | null>(null);
  const [selectedEndTimeDate, setSelectedEndTimeDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {

  type OptionType = "today" | "tomorrow"; 

  const defaultOption: OptionType = "today"; 

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (defaultOption === "today") {
    return today;
  } else if (defaultOption === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }
});

const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (e.target.value === "today") {
    setSelectedDate(today); 
  } else if (e.target.value === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setSelectedDate(tomorrow);
  }
};
  const navigate = useNavigate();
  useEffect(() => {
    if (selectedDate && selectedTime) {
      // Tách giờ và phút từ selectedTime
      const [hours, minutes] = selectedTime.split(":").map(Number);

      // Tạo đối tượng Date từ selectedDate và selectedTime
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(hours, minutes, 0, 0); // Cập nhật giờ, phút

      console.log("Start date time:", startDateTime);
      setSelectedStartTimeDate(startDateTime);

      // Tính toán selectedEndTimeDate bằng cách cộng estimatedTime
      console.log("Selected service:", selectedService);
      if (selectedService) {
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + Number(selectedService?.estimate_time).valueOf());
        setSelectedEndTimeDate(endDateTime);
      }
    }
    console.log("Selected end time:", selectedDate?.toISOString());
  }, [selectedDate, selectedTime, selectedService]);

  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const userData = await getUser();
         console.log("User profile");
        setUserProfile(userData);
        setLoading(false);
        console.log(userData);
        const customerData = await getCustomerProfileByUserId(userData.id);
        console.log("Customer profile");
        console.log(customerData);
        setCustomerProfile(customerData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (!user) {
      console.log("User not found");
      setMessage("Vui lòng đăng nhập");
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Chuyển hướng sau 3 giây
    }
  }, [user, navigate]);
  //Branch
  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      try {
        const data = await fetchBranches();
        setBranches(data);
        console.log("Branch");
        console.log(data);
        const d = new Date();
        const date = d.toISOString();
        console.log("Date now" + date);
      } catch (err) {
        setError("Failed to fetch branches.");
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, []);

  //Voucher
  useEffect(() => {
    const loadVoucher = async () => {
      setLoading(true);
      try {
        const data = await fetchVoucherbyBranchId(selectedBranch?.id);
        const newVoucher: Voucher = data
        setVoucher([newVoucher]); // Replace the current state with an array containing the new voucher
        setVoucher(data);
        console.log("Voucher");
        console.log(data);
      } catch (err) {
        setError("Failed to fetch branches.");
      } finally {
        setLoading(false);
      }
    };
    loadVoucher();
  }, [selectedBranch]);
  //Employee
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const data = await fetchEmployeebyBranchId(selectedBranch?.id);
        setEmployees(data);
        console.log("Employee");
        console.log(data);
      } catch (err) {
        setError("Failed to fetch branches.");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [selectedBranch]);

  //Service
  useEffect(() => {
    const loadSchedule = async () => {
      if (!selectedEmployee?.id) return; // Nếu không có ID, không làm gì cả
      setLoading(true);
      try {
        const data = await getEmployeeSchedule(
          selectedEmployee?.id,
          selectedDate
        );
        setSchedule(data);
        console.log("Schedule");
        console.log(data);
      } catch (err) {
        setError("Failed to fetch schedule.");
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [selectedEmployee]);
  useEffect(() => {
  if (!selectedService) {
    setSelectedVoucher(null); 
  }
}, [selectedService]);
 
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        setServices(data);
        console.log("Service");
        console.log(data);
      } catch (err) {
        setError("Failed to fetch branches.");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

    useEffect(() => {
      const servicePrice = selectedService?.price ?? 0;
      const voucherDiscount = selectedVoucher?.discount_value ?? 0;
      setTotalPayment(servicePrice - voucherDiscount);
    }, [selectedService, selectedVoucher]);
    //total price
  useEffect(() => {
    // Lọc danh sách cửa hàng dựa vào searchTerm
    setBranches(
      branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, []);

  useEffect(() => {
    // Lọc danh sách cửa hàng dựa vào searchTerm
    setEmployees(
      employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.work_position
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, []);

  useEffect(() => {
    setServices(
      services.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.price.toString().includes(searchTerm)
      )
    );
  }, []);

  const handleConfirm = async () => {
    let hasError = false;

    if (!selectedEmployee) {
      setErrorEmployee("Vui lòng chọn nhân viên.");
      hasError = true;
    } else {
      setErrorEmployee(null);
    }

    if (!selectedBranch) {
      setErrorBranch("Vui lòng chọn chi nhánh.");
      hasError = true;
    } else {
      setErrorBranch(null);
    }

    if (!selectedService) {
      setErrorService("Vui lòng chọn dịch vụ.");
      hasError = true;
    } else {
      setErrorService(null);
    }
    if(!selectedTime){
      setErrorTime("Vui lòng chọn thời gian");
      hasError = true;
    } else {
      setErrorTime(null);
    }
    let hours = "";
    let minutes = "";

    if (selectedTime) {
      [hours, minutes] = selectedTime.split(":");
    }
    if (hasError) return;
    try {
      // Gửi API
      const response = await addAppointment({
        title: selectedService?.title,
        date: String(selectedDate?.toISOString()),
        start_time: String(selectedStartTimeDate?.toISOString()),
        estimated_end_time: String(selectedEndTimeDate?.toISOString()),
        final_price: totalPayment,
        employee_id: selectedEmployee?.id,
        user_id: userprofile?.id,
        service_id: selectedService?.id,
        branch_id: selectedBranch?.id,
        status: "Pending",
      });
      
      setSuccessInfo({
        service: " " + selectedService?.title,
        employee: " " + selectedEmployee?.name,
        address: " " + selectedBranch?.address,
        time: " " + selectedDate?.toLocaleDateString() + ", " + String(selectedStartTimeDate?.getHours) + " - " + String(selectedEndTimeDate?.getHours),
        price: " " + totalPayment + "đ",
        status: "Chờ xác nhận",
      });
    } catch (error) {
      console.error("Lỗi khi xác nhận lịch hẹn:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };
  // Hàm xử lý khi thời gian được chọn
  const handleTimeSelect = (time: string | null) => {
    setSelectedTime(time);
    console.log("Selected time:", time);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat pb-10"
      style={{ backgroundImage: `url('/src/customer/assets/bg.png')` }}
    >
      <div className=" pt-10">
        <h1 className="text-3xl font-bold text-center text-white pb-2">
          Đặt lịch hẹn
        </h1>
      </div>

      <div className="m-10 mt-0 flex justify-between bg-white rounded-lg p-10 pb-15 space-x-10">
        {/* Phần bên trái */}
        <div className="w-full ">
          {/* Chọn chi nhánh */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">1. Chọn chi nhánh</h2>
            <div className="flex items-center">
              <button
                className={`px-2 py-2 border rounded-lg mt-8 w-full text-left ${
                  viewType === "branches"
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 hover:bg-blue-500"
                }`}
                onClick={() => setViewType("branches")}
              >
                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                Chọn địa chỉ chi nhánh
              </button>
            </div>
          </div>

          {/* Chọn dịch vụ */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">2. Chọn dịch vụ</h2>
            <div className="flex items-center">
              <button
                className={`px-2 py-2 border rounded-lg mt-8 w-full text-left ${
                  viewType === "services"
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 hover:bg-blue-500"
                }`}
                onClick={() => setViewType("services")}
              >
                <FontAwesomeIcon icon={faScissors} className="mr-2" />
                Chọn dịch vụ với nhiều ưu đãi hấp dẫn
              </button>
            </div>
            <button
              className={`inline-flex items-center px-2 py-2 border rounded-lg mt-8 text-left ${
                viewType === "voucher"
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-gray-200 hover:bg-blue-500"
              }`}
              onClick={() => setViewType("voucher")}
            >
              <FontAwesomeIcon icon={faTicket} className="mr-2" />
              Voucher
            </button>

            <p className="pt-3">
              Tổng thanh toán:{" "}
              {selectedService
                ? (selectedService.price ?? 0) -
                  (selectedVoucher?.discount_value ?? 0)
                : 0}
            </p>
          </div>
          {/* Chọn ngày, giờ & nhân viên */}
          <div>
            <h2 className="text-3xl font-bold mb-1">
              2. Chọn ngày giờ & nhân viên
            </h2>
            <div className="flex items-center pb-4">
              <button
                className={`inline-block px-2 py-2 border rounded-lg mt-4 w-fit ${
                  viewType === "employees"
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-200 hover:bg-blue-500"
                }`}
                onClick={() => setViewType("employees")}
                disabled={!selectedBranch}
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                Chọn nhân viên
              </button>
            </div>
            <div>
              <select
                className="p-2 border rounded-lg flex-grow text-left"
                onChange={handleChange}
                defaultValue="today"
              >
                <option value="tomorrow">Ngày mai</option>
                <option value="today">Hôm nay</option>
              </select>
              <p>
                Ngày được chọn:{" "}
                {selectedDate?.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <TimePicker onTimeSelect={handleTimeSelect} schedule={schedule} />
          </div>

          <button
            className="mt-6 w-full p-3 bg-blue-500 text-white rounded-lg"
            onClick={handleConfirm}
          >
            Xác nhận lịch hẹn
          </button>
          {errorEmployee && (
            <p className="text-red-500 mt-2">{errorEmployee}</p>
          )}
          {errorBranch && <p className="text-red-500 mt-2">{errorBranch}</p>}
          {errorService && <p className="text-red-500 mt-2">{errorService}</p>}
          {successInfo && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex items-center mb-4">
                  <span className="text-green-500 text-xl mr-2">✔</span>
                  <h2 className="text-lg font-bold">Đặt lịch thành công</h2>
                </div>
                <p>
                  <strong>Dịch vụ:</strong> {successInfo.service}
                </p>
                <p>
                  <strong>Nhân viên:</strong> {successInfo.employee}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {successInfo.address}
                </p>
                <p>
                  <strong>Thời gian:</strong> {successInfo.time}
                </p>
                <p>
                  <strong>Tổng tiền ước tính:</strong> {successInfo.price}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {successInfo.status}
                </p>
                <button
                  onClick={() => setSuccessInfo(null)}
                  className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Phần bên phải */}
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm chi nhánh"
              className="w-full p-3 pl-9 mb-6 rounded-lg border-2 border-black"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute top-5  left-4 text-gray-500 font-bold"
            />

            <BranchList
              viewType={viewType}
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />

            <ServiceList
              viewType={viewType}
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
            <VoucherList
              viewType={viewType}
              vouchers={voucher}
              selectedVoucher={selectedVoucher}
              setSelectedVoucher={setSelectedVoucher} // Do nothing
              user={userprofile}
              selectedDate={new Date(Date.UTC(2024, 11, 1, 0, 0, 0))}
              selectedService={selectedService}
            />
            <EmployeeList
              viewType={viewType}
              employees={employees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
