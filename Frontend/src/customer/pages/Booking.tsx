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

import ServiceList from "../components/Booking/ServiceList";
import BranchList from "../components/Booking/BranchList";
import TimePicker from "../components/Booking/TimePicker";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBranches } from "../services/BookingService";
import { Branch, Employee, Service } from "../utils/types";
import { fetchEmployeebyBranchId } from "../services/employeeService";
import { fetchServices } from "../services/serviceService";
import { addBranch } from "../services/appointment";
import { useAuth } from "../context/AuthContext";

import EmployeeList from "../components/Booking/EmployeeList";
const Booking: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState("branches");
  const [stores, setStores] = useState([]);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [errorEmployee, setErrorEmployee] = useState<string | null>(null);
  const [errorBranch, setErrorBranch] = useState<string | null>(null);
  const [errorService, setErrorService] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<any | null>(null);
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

    if (hasError) return;
    try {
      // Gửi API
      const response = await addBranch({
        title: selectedService?.title,
        date: Date(),
        start_time: selectedTime,
        estimatedEndTime: selectedService?.estimatedTime,
        status: "pending",
        finalPrice: selectedService?.price,
        employeeId: selectedEmployee?.id,
        serviceId: selectedService?.id,
        branchId: selectedBranch?.id,
      });

      // Nếu thành công, lưu thông tin và hiện thông báo
      setSuccessInfo({
        service: "Cắt tóc",
        employee: "Ironman",
        address: "19x Nguyễn Trãi, Thanh Xuân, Hà Nội",
        time: "10/10/2024, 10:00AM - 13:00PM",
        price: "350,000 VND",
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

            <button className="inline-block px-2 py-2 border rounded-lg mt-4 w-fit bg-gray-200  hover:bg-blue-500">
              <FontAwesomeIcon icon={faCity} className="mr-2" />
              Tìm chi nhánh gần nhất
            </button>
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
            <button className="inline-block px-2 py-2 border rounded-lg mt-4 bg-gray-200 w-fit hover:bg-blue-500">
              <FontAwesomeIcon icon={faTicket} className="mr-2" />
              Voucher
            </button>
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
            <div className="flex items-center mb-3">
              <span className="mr-2">📅</span>
              <select className="p-2 border rounded-lg flex-grow text-left">
                <option value="tomorrow">Ngày mai</option>
                <option value="today">Hôm nay</option>
                <option value="next-week">Tuần sau</option>
              </select>
            </div>
            <TimePicker onTimeSelect={handleTimeSelect} />
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
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
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
