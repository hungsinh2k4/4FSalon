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
import { useState } from "react";
import { useEffect } from "react";
import { fetchBranches } from "../services/BookingService";
import { Branch, Employee, Service } from "../utils/types";
import { fetchEmployeebyBranchId } from "../services/employeeService";
import { fetchServices } from "../services/serviceService";
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
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filteredList, setFilteredList] = useState([]);

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
            <div className="grid grid-cols-4 gap-2 w-full">
              {[
                "7:00",
                "8:00",
                "9:00",
                "10:00",
                "11:00",
                "13:00",
                "14:00",
                "7:20",
                "8:20",
                "9:20",
                "10:20",
                "11:20",
                "13:20",
                "14:20",
                "7:40",
                "8:40",
                "9:40",
                "10:40",
                "11:40",
                "13:40",
                "14:40",
              ].map((time, index) => (
                <button
                  key={index}
                  className="p-2 bg-gray-300 rounded-lg text-center hover:bg-gray-400"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-6 w-full p-3 bg-blue-500 text-white rounded-lg">
            Xác nhận lịch hẹn
          </button>
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
            {viewType === "branches" && (
              <div className="mt-2 max-h-[500px] overflow-y-auto border border-gray-300 p-1.25">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() =>
                      setSelectedBranch(
                        selectedBranch?.id === branch.id ? null : branch
                      )
                    } // Nếu đã chọn thì bỏ chọn, nếu chưa thì chọn
                    className={`w-full h-[150px] my-10 ${
                      selectedBranch?.id === branch.id
                        ? "bg-blue-200 border-blue-500" // Style khi được chọn
                        : "bg-gray-100 border-gray-300"
                    } cursor-pointer text-left flex items-center`}
                  >
                    <div className="w-1/3 h-full overflow-hidden">
                      <img
                        src="/src/customer/assets/bg.png"
                        alt="branch image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <strong>{branch.name}</strong>
                      <div className="text-sm text-gray-600">
                        {branch.address}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {viewType === "services" && (
              <div className="mt-2.5 max-h-[500px] overflow-y-auto border border-gray-300 rounded-s-lg p-2 grid grid-cols-2 gap-3.5">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() =>
                      setSelectedService(
                        selectedService?.id === service.id ? null : service
                      )
                    } // Nếu đã chọn thì bỏ chọn, nếu chưa thì chọn
                    className={`w-full py-6.5 h-[400px] my-2.5 ${
                      selectedService?.id === service.id
                        ? "bg-blue-200 border-blue-500" // Style khi được chọn
                        : "bg-gray-100 border-[#0a0a0a]"
                    } cursor-pointer text-left flex`}
                  >
                    <div className="w-2/5 h-full overflow-hidden">
                      <img
                        src="src/customer/assets/Booking/employees.jpeg"
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <strong>{service.title}</strong>
                      <div className="text-sm text-gray-600">
                        {service.price}
                      </div>
                      <div className="text-sm text-gray-600">
                        {service.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {viewType === "employees" && (
              <div className="mt-2.5 max-h-[500px] overflow-y-auto border border-gray-300 rounded-s-lg p-2 grid grid-cols-2 gap-3.5">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() =>
                      setSelectedEmployee(
                        selectedEmployee?.id === employee.id ? null : employee
                      )
                    } // Nếu đã chọn thì bỏ chọn, nếu chưa thì chọn
                    className={`w-full py-6.5 h-[400px] my-2.5 ${
                      selectedEmployee?.id === employee.id
                        ? "bg-blue-200 border-blue-500" // Style khi được chọn
                        : "bg-gray-100 border-[#0a0a0a]"
                    } cursor-pointer text-left flex`}
                  >
                    <div className="w-2/5 h-full overflow-hidden">
                      <img
                        src="src/customer/assets/Booking/employees.jpeg"
                        alt={employee.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <strong>{employee.name}</strong>
                      <div className="text-sm text-gray-600">
                        {employee.phone}
                      </div>
                      <div className="text-sm text-gray-600">
                        {employee.work_position}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
