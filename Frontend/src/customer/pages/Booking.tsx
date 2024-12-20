import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faScissors,
  faSearch,
  faTicket,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import {
  Branch,
  Employee,
  Service,
  Voucher,
  User,
} from "../utils/types";
import Loading from "../components/Loading";
import ServiceList from "../components/Booking/ServiceList";
import BranchList from "../components/Booking/BranchList";
import TimePicker from "../components/Booking/TimePicker";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBranches } from "../services/Booking/BookingService";
import { fetchEmployeebyBranchId } from "../services/Booking/employeeService";
import { fetchServices } from "../services/Booking/serviceService";
import VoucherList from "../components/Booking/VoucherList";
import { addAppointment, changeAppointment } from "../services/Booking/appointment";
import EmployeeList from "../components/Booking/EmployeeList";
import { fetchVoucherbyBranchId } from "../services/Booking/VoucherService";
import { getEmployeeSchedule } from "../api/employees";
import {
  getUser,
  getAppointmentList,
} from "../api/user";
import { Schedule } from "../utils/types";
import { useSearchParams } from "react-router-dom";
import { beautifyPrice } from "../utils/helpers";
import { editCustomer } from "../../manager/services/appointmentService";


const Booking: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState("branches");
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [voucher, setVoucher] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null | null>(null);
  const [errorEmployee, setErrorEmployee] = useState<string | null>(null);
  const [errorBranch, setErrorBranch] = useState<string | null>(null);
  const [errorService, setErrorService] = useState<string | null>(null);
  const [errorTime, setErrorTime] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<any | null>(null);
  const [userprofile, setUserProfile] = useState<User | null>(null);

  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [selectedStartTimeDate, setSelectedStartTimeDate] =
    useState<Date | null>(null);
  const [selectedEndTimeDate, setSelectedEndTimeDate] = useState<Date | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedBranch) {
      setErrorBranch("");
    }
  }, []);

  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");
  const branchId = searchParams.get("branch_id");

  useEffect(() => {
    const loadCurrentAppointment = async () => {
      const data = await getAppointmentList("id=" + appointmentId);
      if (data[0]?.status === "cancelled" || data[0]?.status === "completed") {
        navigate(`/appointment?id=${appointmentId}`);
      }
      if (data[0]?.branch) {
        setSelectedBranch(data[0].branch);
      }
      if (data[0]?.voucher) {
        setSelectedVoucher(data[0].voucher);
      }
      if (data[0]?.service) {
        setSelectedService(data[0].service);
      }
      if (data[0]?.employee) {
        setSelectedEmployee(data[0].employee);
      }
      if (data[0]?.date) {
        setSelectedDate(new Date(data[0].date));
      }
      if (data[0]?.start_time) {
        setSelectedTime(data[0].start_time);
      }

    };

    if (appointmentId) {
      loadCurrentAppointment();
    }
  }, [appointmentId]);

  useEffect(() => {
    const loadBranch = async () => {
      const data = await fetchBranches();
      if (data) {
        const branch = data.find((branch) => branch.id === Number(branchId));
        if (branch) {
          setSelectedBranch(branch);
        }
        setViewType("services");
      }
    };
    if (branchId) {
      loadBranch();
    }
  }, [branchId]);

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
    today.setHours(8, 0, 0, 0);
    if (e.target.value === "today") {
      setSelectedDate(today);
    } else if (e.target.value === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(8, 0, 0, 0);
      setSelectedDate(tomorrow);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTime) {
      // Tách giờ và phút từ selectedTime
      const [hours, minutes] = selectedTime.split(":").map(Number);

      // Tạo đối tượng Date từ selectedDate và selectedTime
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(hours, minutes, 0, 0); // Cập nhật giờ, phút

      setSelectedStartTimeDate(startDateTime);

      // Tính toán selectedEndTimeDate bằng cách cộng estimatedTime
      if (selectedService) {
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(
          endDateTime.getMinutes() +
          Number(selectedService?.estimate_time).valueOf()
        );
        setSelectedEndTimeDate(endDateTime);
      }
    }
  }, [selectedDate, selectedTime, selectedService]);

  const resetState = () => {
    setSelectedEmployee(null);
    setSelectedService(null);
    setSelectedVoucher(null);
    setSelectedTime(null);
    setSelectedDate(new Date());
    setSelectedStartTimeDate(null);
    setSelectedEndTimeDate(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUserProfile(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  //Branch
  useEffect(() => {
    const loadBranches = async () => {
      setLoading(true);
      try {
        const data = await fetchBranches();
        setBranches(data);
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
        setVoucher(Array.isArray(data) ? data : []);
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
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setError("Failed to fetch employees.");
        }
      } catch (err) {
        setError("Failed to fetch branches.");
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, [selectedBranch]);

  //Schedule
  useEffect(() => {
    const loadSchedule = async () => {
      if (!selectedEmployee?.id) return; // If no ID, do nothing
      setLoading(true);
      try {
        const data = await getEmployeeSchedule(
          selectedEmployee?.id,
          selectedDate
        );

        setSchedule(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch schedule.");
      } finally {
        setLoading(false);
      }

    };

    loadSchedule();
  }, [selectedEmployee, selectedDate]);


  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        setServices(data);
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
    let voucherDiscount = selectedVoucher?.discount_value ?? 0;
    if (selectedVoucher?.discount_type === "percentage") {
      voucherDiscount = Math.floor((servicePrice * voucherDiscount) / 100); // Rounds down to the nearest integer
    }
    console.log(selectedVoucher);
    setTotalPayment(servicePrice - voucherDiscount);
  }, [selectedService, selectedVoucher]);
  //total price

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
    if (!selectedTime) {
      setErrorTime("Vui lòng chọn thời gian");
      hasError = true;
    } else {
      setErrorTime(null);
    }

    if (hasError) return;
    try {
      // Gửi API
      if (appointmentId == null) {

        await addAppointment({
          title: selectedService?.title,
          date: String(selectedDate?.toISOString()),
          start_time: String(selectedStartTimeDate?.toISOString()),
          estimated_end_time: String(selectedEndTimeDate?.toISOString()),
          final_price: totalPayment,
          employee_id: selectedEmployee?.id,
          user_id: userprofile?.id,
          service_id: selectedService?.id,
          voucher_id: selectedVoucher?.id,
          branch_id: selectedBranch?.id,
          status: "Pending",
        });
      } else {
        await changeAppointment(Number(appointmentId), {
          title: selectedService?.title,
          date: String(selectedDate?.toISOString()),
          start_time: String(selectedStartTimeDate?.toISOString()),
          estimated_end_time: String(selectedEndTimeDate?.toISOString()),
          final_price: totalPayment,
          employee_id: selectedEmployee?.id,
          user_id: userprofile?.id,
          service_id: selectedService?.id,
          voucher_id: selectedVoucher?.id,
          branch_id: selectedBranch?.id,
          status: "Pending",
        });
      }

      setSuccessInfo({
        service: " " + selectedService?.title,
        employee: " " + selectedEmployee?.name,
        address: " " + selectedBranch?.address,
        time:
          " " +
          selectedStartTimeDate?.getHours().toString() +
          ":" +
          selectedStartTimeDate?.getMinutes().toString() +
          ", " +
          selectedDate?.toLocaleDateString(),
        price: " " + totalPayment + "đ",
        status: "Chờ xác nhận",
      });
    } catch (error) {
      console.error("Lỗi khi xác nhận lịch hẹn:", error);
    }
  };
  // Hàm xử lý khi thời gian được chọn
  const handleTimeSelect = (time: string | null) => {
    setSelectedTime(time);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-no-repeat pb-10"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1621645582931-d1d3e6564943?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
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
                className={`px-2 py-2 border rounded mt-8 w-fit text-left ${viewType === "branches"
                    ? "bg-teal-600 text-white font-bold"
                    : "bg-gray-200 hover:bg-teal-600 hover:text-white"
                  }`}
                onClick={() => {
                  setViewType("branches"), setErrorBranch("");
                }}
              >
                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                <span>
                  {selectedBranch ? selectedBranch.address : "Chọn chi nhánh"}
                </span>
              </button>
            </div>
            {errorBranch && <p className="text-red-500 mt-2">{errorBranch}</p>}
          </div>

          {/* Chọn dịch vụ */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-1">2. Chọn dịch vụ</h2>
            <div className="flex items-center">
              <button
                className={`px-2 py-2 border rounded mt-8 w-full text-left ${viewType === "services"
                    ? "bg-teal-600 text-white font-bold"
                    : "bg-gray-200 hover:hover:bg-teal-600 hover:text-white"
                  }`}
                onClick={() => {
                  if (!selectedBranch) {
                    setErrorBranch("Vui lòng chọn chi nhánh trước");
                    return;
                  }

                  setViewType("services");
                  setErrorService("");
                }}
              >
                <FontAwesomeIcon icon={faScissors} className="mr-2" />
                {selectedService
                  ? selectedService.title
                  : "Chọn dịch vụ với nhiều ưu đãi hấp dẫn"}
              </button>
            </div>
            {errorService && (
              <p className="text-red-500 mt-2">{errorService}</p>
            )}
            <button
              className={`inline-flex items-center px-2 py-2 border rounded mt-8 text-left w-full ${viewType === "voucher"
                  ? "bg-teal-600 text-white font-bold"
                  : "bg-gray-200 hover:bg-teal-600 hover:text-white"
                }`}
              onClick={() => {
                if (!selectedBranch || !selectedService) {
                  if (!selectedBranch) {
                    setErrorBranch("Vui lòng chọn chi nhánh trước");
                  }
                  if (!selectedService) {
                    setErrorService("Vui lòng chọn dịch vụ trước");
                  }
                  return;
                }

                setViewType("voucher");
              }}
            >
              <FontAwesomeIcon icon={faTicket} className="mr-2" />
              {selectedVoucher ? selectedVoucher?.code : "Voucher"}
            </button>

            <p className="pt-3 text-green-700	">
              Tổng thanh toán:{" "}
              {selectedService
                ? (selectedService.price ?? 0) -
                (selectedVoucher?.discount_value ?? 0)
                : 0} VNĐ
            </p>
          </div>
          {/* Chọn ngày, giờ & nhân viên */}
          <div>
            <h2 className="text-3xl font-bold mb-1">
              3. Chọn ngày giờ & nhân viên
            </h2>
            <div className="flex items-center mb-1">
              <button
                className={`inline-block px-2 py-2 border rounded mt-4 w-full text-left ${viewType === "employees"
                    ? "bg-teal-600 text-white font-bold"
                    : "bg-gray-200 hover:bg-teal-600 hover:text-white"
                  }`}
                onClick={() => {
                  if (!selectedBranch || !selectedService) {
                    if (!selectedBranch) {
                      setErrorBranch("Vui lòng chọn chi nhánh trước");
                    }
                    if (!selectedService) {
                      setErrorService("Vui lòng chọn dịch vụ trước");
                    }
                    return;
                  }

                  setViewType("employees");
                  setErrorEmployee("");
                }}
              // disabled={!selectedBranch || !selectedService}
              >
                <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                Chọn nhân viên
              </button>
            </div>
            {errorEmployee && (
              <p className="text-red-500 mb-2">{errorEmployee}</p>
            )}
            <div>
              <select
                className="p-2 border rounded-lg flex-grow text-left"
                onChange={handleChange}
                defaultValue="today"
                disabled={!selectedBranch || !selectedService}
              >
                <option value="tomorrow">Ngày mai</option>
                <option value="today">Hôm nay</option>
              </select>
              <p className="pb-3 pt-2">
                Ngày được chọn:{" "}
                {selectedDate?.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <TimePicker
              timeBlock={Math.floor(
                Number(selectedService?.estimate_time) / 20
              )}
              onTimeSelect={handleTimeSelect}
              schedule={schedule}
              selectedDate={selectedDate}
              isDisplaying={selectedEmployee == null ? false : true}
              setErrorTime={setErrorTime}
            />
            {errorTime && <p className="text-red-500 mt-2">{errorTime}</p>}
          </div>

          <button
            className="mt-6 w-full p-3 bg-black text-white rounded-full text-center font-medium hover:bg-gray-900 active:bg-gray-800"
            onClick={handleConfirm}
          >
            Đặt ngay
          </button>

          {successInfo && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex items-center mb-4">
                  <span className="text-green-500 text-xl mr-2">✔</span>
                  <h2 className="text-center font-bold">Đặt lịch thành công</h2>
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
                  onClick={() => {
                    setSuccessInfo(null);
                    navigate("/appointment");
                  }}
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
              placeholder=""
              className="w-full p-3 pl-9 mb-6 rounded-lg border-2 border-black"
              onChange={(e) => setSearchTerm(e.target.value)}
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
              resetState={resetState}
              searchTerm={searchTerm}
            />

            <ServiceList
              viewType={viewType}
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              setSelectedVoucher={setSelectedVoucher}
              searchTerm={searchTerm}
            />
            <VoucherList
              viewType={viewType}
              vouchers={voucher}
              selectedVoucher={selectedVoucher}
              setSelectedVoucher={setSelectedVoucher} 
              user={userprofile}
              selectedDate={selectedDate}
              selectedService={selectedService}
              searchTerm={searchTerm}
            />
            <EmployeeList
              viewType={viewType}
              employees={employees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
