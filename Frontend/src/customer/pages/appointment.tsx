import { useEffect, useState } from "react";
import {
  cancelAppointment,
  getAppointmentList,
  postFeedback,
} from "../api/user";
import { Feedback, MyAppointment } from "../utils/types";
import { useAuth } from "../context/AuthContext";
import {
  beautifyDate,
  beautifyPrice,
  beautifyStatus,
  beautifyTime,
} from "../utils/helpers";
import { FaAngleRight } from "react-icons/fa";

import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import Rating from "../components/Rating";
import ChipCheckbox from "../components/ChipCheckbox";
import Modal from "../components/Modal";

import map from "../assets/Appointment/map-marker-svgrepo-com.svg";
import mail from "../assets/Appointment/email-mail-svgrepo-com.svg";
import phone from "../assets/Appointment/phone-svgrepo-com.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { set } from "rsuite/esm/internals/utils/date";

const goodBranchOptions = [
  "Sạch sẽ",
  "Dễ tìm",
  "Nhân viên thân thiện",
  "Dịch vụ tốt",
  "Giá cả hợp lý",
];
const badBranchOptions = [
  "Không sạch sẽ",
  "Khó tìm",
  "Nhân viên không thân thiện",
  "Dịch vụ không tốt",
  "Giá cả không hợp lý",
];
const goodEmployeeOptions = [
  "Nhiệt tình",
  "Nhanh nhẹn",
  "Kỹ năng tốt",
  "Tận tâm",
  "Thân thiện",
];
const badEmployeeOptions = [
  "Không nhiệt tình",
  "Chậm chạp",
  "Kỹ năng không tốt",
  "Không tận tâm",
  "Không thân thiện",
];

const pageSlice = 5;

const Appointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(false);
  const [appointmentList, setAppointmentList] = useState<MyAppointment[]>([]);
  const [page, setPage] = useState<number>(1);

  const [showDetails, setShowDetails] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<MyAppointment | null>(null);

  const [feedback, setFeedback] = useState<Partial<Feedback> | null>(null);
  const [selectedBranchChips, setSelectedBranchChips] = useState<string[]>([]);
  const [selectedEmployeeChips, setSelectedEmployeeChips] = useState<string[]>(
    []
  );
  const [notHaveFeedback, setNotHaveFeedback] = useState<boolean>(true);
  const [suggestion, setSuggestion] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(false);
    const loadAppointmentList = async () => {
      try {
        const data = await getAppointmentList(
          `user_id=${user?.id}&have_feedback=true&order=desc`
        );

        setAppointmentList(data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };
    if (user) {
      loadAppointmentList();
    }
  }, [reload, user]);

  const showError = (error: any) => {
    return (
      <div className="flex flex-col gap-3 w-full h-fit items-center">
        <p className="select-none">{error}</p>
        <button
          className="w-fit h-fit px-2 py-1 bg-gray-300 hover:bg-gray-200"
          onClick={() => setReload(!reload)}
        >
          Thử lại
        </button>
      </div>
    );
  };

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isShowingFeedback = searchParams.get("feedback");

  console.log(id, isShowingFeedback);

  useEffect(() => {
    if (id == null && isShowingFeedback == null) {
      setShowFeedback(false);
      setShowDetails(false);
    }
  }, [id, isShowingFeedback]);

  useEffect(() => {
    if(id && isShowingFeedback == null) {
      setShowFeedback(false);
      setShowDetails(true);
    }
  })

  useEffect(() => {
    
  });

  useEffect(() => {
    if (id && selectedAppointment === null) {
      setShowFeedback(false);
      setShowDetails(true);
      console.log(showDetails);

      const loadAppointmentList = async () => {
        await getAppointmentList(`id= ${id}&have_feedback=true`).then(
          (data) => {
            setSelectedAppointment(data[0]);
            setNotHaveFeedback(data[0].feedback ? false : true);
            setFeedback(data[0].feedback);

            if (isShowingFeedback) {
              const feedbackReloadHandle = async () => {
                if (data[0].feedback) {
                  handleBranchRating(data[0].feedback.branch_rating ?? 0);
                  handleEmployeeRating(data[0].feedback.employee_rating ?? 0);
                  if (data[0].feedback.branch_feedback) {
                    setSelectedBranchChips(
                      data[0].feedback.branch_feedback.split(", ")
                    );
                  }

                  if (data[0].feedback.employee_feedback) {
                    setSelectedEmployeeChips(
                      data[0].feedback.employee_feedback.split(", ")
                    );
                  }
                  setNotHaveFeedback(data[0].feedback ? false : true);
                }
              };
              feedbackReloadHandle();
              setShowFeedback(true);
              setShowDetails(false);
            }
          }
        );
      };
      loadAppointmentList();
    }
  }, [id, isShowingFeedback, selectedAppointment, feedback]);

  const handleBranchChipChange = (label: string) => {
    setSelectedBranchChips((prevSelectedChips) =>
      prevSelectedChips.includes(label)
        ? prevSelectedChips.filter((chip) => chip !== label)
        : [...prevSelectedChips, label]
    );
  };

  const handleEmployeeChipChange = (label: string) => {
    setSelectedEmployeeChips((prevSelectedChips) =>
      prevSelectedChips.includes(label)
        ? prevSelectedChips.filter((chip) => chip !== label)
        : [...prevSelectedChips, label]
    );
  };

  const clearBranchChips = () => {
    setSelectedBranchChips([]);
  };

  const clearEmployeeChips = () => {
    setSelectedEmployeeChips([]);
  };

  const handleStatusColor = (status: string) => {
    let m_status = beautifyStatus(status);
    switch (m_status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "Confirmed":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleStatusDisplay = (status: string) => {
    let m_status = beautifyStatus(status);
    switch (m_status) {
      case "Completed":
        return "Hoàn thành";
      case "Pending":
        return "Chờ xác nhận";
      case "Cancelled":
        return "Đã hủy";
      case "Confirmed":
        return "Đã xác nhận";
      default:
        return "Không xác định";
    }
  };

  const handleDetailButton = (appointment: MyAppointment) => {
    setSelectedAppointment(appointment);
    if (appointment.status === "completed") {
      setFeedback(appointment.feedback);
    }
    if (appointment.feedback) {
      setNotHaveFeedback(false);
    }
    setShowDetails(true);
    clearBranchChips();
    clearEmployeeChips();
    navigate("/appointment?id=" + appointment.id);
  };

  const handleCancelAppointment = async () => {
    if (
      selectedAppointment &&
      selectedAppointment.status !== "cancelled" &&
      selectedAppointment.status !== "completed"
    ) {
      try {
        const modifiedAppointment = {
          ...selectedAppointment,
          status: "cancelled",
        };
        await cancelAppointment(modifiedAppointment);
        // fetch updated data
        const updatedData = await getAppointmentList(
          `user_id=${user?.id}&have_feedback=true&order=desc`
        );
        setAppointmentList(updatedData);
        setSelectedAppointment({ ...selectedAppointment, status: "cancelled" });
        setShowAlert(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEditAppointment = async () => {
    if (
      selectedAppointment &&
      selectedAppointment.status !== "cancelled" &&
      selectedAppointment.status !== "completed"
    ) {
      navigate("/booking?appointment_id=" + selectedAppointment.id);
    }
  };

  const handleAppointmentListHeader = () => {
    setSelectedAppointment(null);
    setShowDetails(false);
    setShowFeedback(false);
    setNotHaveFeedback(true);
    navigate("/appointment");
  };

  const handleDetailHeader = () => {
    if (selectedAppointment) {
      setShowDetails(true);
      setShowFeedback(false);
      navigate("/appointment?id=" + selectedAppointment.id);
    }
  };

  const handleFeedbackButton = () => {
    //Double check status
    if (selectedAppointment && selectedAppointment.status === "completed") {
      setShowDetails(false);

      if (selectedAppointment.feedback) {
        setFeedback(selectedAppointment.feedback);
        if (selectedAppointment.feedback.branch_feedback) {
          setSelectedBranchChips(
            selectedAppointment.feedback.branch_feedback.split(", ")
          );
        }
        if (selectedAppointment.feedback.employee_feedback) {
          setSelectedEmployeeChips(
            selectedAppointment.feedback.employee_feedback.split(", ")
          );
        }
        setNotHaveFeedback(false);
      } else {
        setFeedback({
          id: 0,
          branch_rating: 0,
          branch_feedback: "",
          employee_rating: 0,
          employee_feedback: "",
          overall_rating: 0,
          appointment_id: selectedAppointment.id,
        });
        selectedAppointment.feedback = feedback as Feedback;
        setNotHaveFeedback(true);
      }
      setShowFeedback(true);
      navigate("/appointment?id=" + selectedAppointment.id + "&feedback=true");
    }
  };

  const handleBranchRating = (rating: number) => {
    const prevRating = feedback?.branch_rating ?? 0;
    if ((rating < 4 && prevRating >= 4) || (rating >= 4 && prevRating < 4)) {
      clearBranchChips();
    }
    setFeedback(feedback && { ...feedback, branch_rating: rating });
  };

  const handleEmployeeRating = (rating: number) => {
    const prevRating = feedback?.employee_rating ?? 0;
    if ((rating < 4 && prevRating >= 4) || (rating >= 4 && prevRating < 4)) {
      clearEmployeeChips();
    }
    setFeedback(feedback && { ...feedback, employee_rating: rating });
  };

  const handleOverallFeedback = (rating: number) => {
    setFeedback(feedback && { ...feedback, overall_rating: rating });
  };

  const validateFeedback = () => {
    if (feedback) {
      if (
        feedback.branch_rating === 0 ||
        feedback.employee_rating === 0 ||
        feedback.overall_rating === 0
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  const handleSubmitFeedback = async () => {
    if (feedback && feedback.id === 0) {
      if (selectedBranchChips.length !== 0) {
        feedback.branch_feedback = selectedBranchChips.join(", ");
      } else {
        delete feedback.branch_feedback;
      }
      if (selectedEmployeeChips.length !== 0) {
        feedback.employee_feedback = selectedEmployeeChips.join(", ");
      } else {
        delete feedback.employee_feedback;
      }
      if (suggestion.length !== 0) {
        feedback.suggestion = suggestion;
      } else {
        delete feedback.suggestion;
      }
      try {
        await postFeedback(feedback);
        setShowFeedback(false);
        setShowFeedback(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Cannot submit feedback");
    }
  };

  const handleModal = () => {
    setShowAlert(true);
    console.log(showAlert);
  };

  return (
    <div
      className={`relative flex min-h-screen flex-col justify-top items-center overflow-hidden bg-gray-50 py-6 sm:py-12 `}
    >
      <div className="relative bg-white px-4 pt-8 pb-6 shadow-xl ring-1 ring-gray-900/5 sm:ml-0 w-full max-w-4xl mx-10 sm:rounded-lg sm:px-10 overflow-auto overscroll-auto">
        <div>
          <h1 className="text-2xl font-bold text-center mb-6">
            Lịch hẹn của bạn
          </h1>
          <div className="flex flex-row justify-start align-middle border-b-2 mb-3">
            <div
              className="font-bold hover:underline cursor-pointer select-none"
              onClick={() => handleAppointmentListHeader()}
            >
              Danh sách lịch hẹn
            </div>
            <div
              className={`flex flex-row justify-start align-middle ${
                showDetails || showFeedback ? "block" : "hidden"
              }`}
              onClick={() => handleDetailHeader()}
            >
              <FaAngleRight className="text-2xl mx-2" />
              <div className={`font-bold hover:underline cursor-pointer`}>
                Lịch hẹn #
                {selectedAppointment !== null ? selectedAppointment.id : ""}
              </div>
            </div>
            <div
              className={`flex flex-row justify-start align-middle ${
                showFeedback ? "block" : "hidden"
              }`}
            >
              <FaAngleRight className="text-2xl mx-2" />
              <div className="font-bold hover:underline cursor-pointer">
                Đánh giá
              </div>
            </div>
          </div>
          {loading && <Loading isVisible={loading} />}
          {error && showError("Có lỗi đã xảy ra! Vui lòng thử lại")}
          <div className="relative min-h-full">
            {/* ----------------------------------------------------List---------------------------------------------------- */}
            <div
              className={`${
                !showDetails && !showFeedback ? "block" : "hidden"
              } space-y-4`}
            >
              {appointmentList
                .slice(
                  (page - 1) * pageSlice,
                  (page - 1) * pageSlice + pageSlice
                )
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`border border-gray-200 rounded-lg p-4 shadow-sm bg-white`}
                  >
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Lịch hẹn #{appointment.id}
                      </h2>
                      <span
                        className={`text-sm ${handleStatusColor(
                          appointment.status
                        )} px-3 py-1 rounded-full`}
                      >
                        {handleStatusDisplay(appointment?.status)}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Dịch vụ:{" "}
                      <span className="font-semibold">
                        {appointment.service
                          ? appointment.service.title
                          : "Không xác định"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Ngày hẹn:{" "}
                      <span className="font-semibold">
                        {beautifyDate(appointment.date)}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Bắt đầu:{" "}
                      <span className="font-semibold">
                        {beautifyTime(appointment.start_time)}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Địa chỉ:{" "}
                      <span className="font-semibold">
                        {appointment.branch
                          ? appointment.branch.address
                          : "Không xác định"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Thanh toán:{" "}
                      <span className="font-semibold">
                        {beautifyPrice(appointment.final_price)}
                      </span>
                    </p>
                    <div className="flex justify-end">
                      <button
                        className="text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit"
                        onClick={() => handleDetailButton(appointment)}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              <Pagination
                prev
                last
                next
                first
                total={appointmentList.length}
                limit={pageSlice}
                activePage={page}
                onChangePage={(page: number) => {
                  setPage(page);
                  window.scrollTo(0, 0);
                }}
              />
            </div>
            {/* ----------------------------------------------------Detail---------------------------------------------------- */}
            <div
              className={`${
                showDetails ? "block" : "hidden"
              } min-h-96 relative`}
            >
              {showDetails && (
                <>
                  <div className="container mx-auto p-1">
                    {selectedAppointment !== null && (
                      <div className="w-full mx-auto border border-gray-200 rounded-lg shadow-sm bg-white p-6">
                        {/* <div className="flex justify-between py-2 border-b-2 w-full">
											<h2 className="text-xl font-semibold">Lịch hẹn #{selectedAppointment.id}</h2>
											<div className={`rounded-md px-2 py-1 align-middle justify-center ${handleStatusColor(selectedAppointment.status)}`}>
												<p className="text-sm font-medium text-white">{handleStatusDisplay(selectedAppointment?.status)}</p>
											</div>
										</div>   */}
                        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6">
                          <h2 className="text-2xl font-semibold text-gray-800">
                            Lịch hẹn #{selectedAppointment.id}
                          </h2>
                          <span
                            className={`text-sm ${handleStatusColor(
                              selectedAppointment.status
                            )} px-3 py-1 rounded-full`}
                          >
                            {handleStatusDisplay(selectedAppointment?.status)}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                          {/* <div className="space-y-4">
												<p className="font-bold">Chi tiết lịch hẹn</p>
												<p className="text-gray-600 font-medium">Dịch vụ: <span className="font-semibold">{selectedAppointment?.service.title}</span></p>
												<p className="text-gray-600 font-medium">Ngày hẹn: <span className="font-semibold">{beautifyDate(selectedAppointment?.date)}</span></p>
												<p className="text-gray-600 font-medium">Bắt đầu: <span className="font-semibold">{beautifyTime(selectedAppointment?.start_time)}</span></p>
												<p className="text-gray-600 font-medium">Kết thúc: <span className="font-semibold">{beautifyTime(selectedAppointment?.estimated_end_time)}</span></p>
												<p className="text-gray-600 font-medium">Thanh toán: <span className="font-semibold">{beautifyPrice(selectedAppointment?.final_price)}</span></p>
												<p className="text-gray-600 font-medium">Thời gian đặt lịch: <span className="font-semibold">{beautifyTime(selectedAppointment?.created_at)}, {beautifyDate(selectedAppointment.created_at)}</span></p>
											</div>
											<div className="flex flex-col h-100 gap-1 mt-2">
												<p className="font-bold">Nhân viên phục vụ</p>
												<div className="flex gap-2 items-center border border-solid border-teal-700 rounded-3xl px-1 py-1">
													<img src={selectedAppointment?.employee?.picture_url ?? ''} alt="" className="w-10 h-10 rounded-full" />
													<p className="text-gray-600">{selectedAppointment?.employee?.name}</p>
												</div>
												<p className="text-gray-600">Email: {selectedAppointment?.employee?.email}</p>
												<p className="text-gray-600">Số điện thoại: {selectedAppointment?.employee?.phone}</p>
											</div> */}

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Thông tin lịch hẹn
                            </h3>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Dịch vụ:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {selectedAppointment?.service
                                  ? selectedAppointment?.service?.title
                                  : "Không xác định"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Ngày hẹn:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {beautifyDate(selectedAppointment.date)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Thời gian:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {beautifyTime(selectedAppointment.start_time)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Ước tính kết thúc:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {beautifyTime(
                                  selectedAppointment.estimated_end_time
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Thanh toán:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {beautifyPrice(selectedAppointment.final_price)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Thông tin nhân viên
                            </h3>
                            <div className="flex items-center justify-center space-x-4">
                              <img
                                src={`${selectedAppointment.employee?.picture_url}`}
                                alt="Stylist Image"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                              />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Tên:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {selectedAppointment.employee?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                Email:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {selectedAppointment.employee?.email}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">
                                SĐT:
                              </span>
                              <span className="text-gray-800 font-semibold">
                                {selectedAppointment.employee?.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex flex-col">
											<p className="font-bold">Thông tin chi nhánh</p>
											<div className="flex flex-row gap-4">
												<div>
													<img src={selectedAppointment?.branch?.picture_url ?? ''} alt="branch" className="w-24 h-24 rounded-md" />
												</div>
												<div className="flex flex-col gap-1">
													<p className="text-gray-600">Địa chỉ: {selectedAppointment?.branch.address}</p>
													<p className="text-gray-600">Số điện thoại: {selectedAppointment?.branch.phone}</p>
													<p className="text-gray-600">Email: {selectedAppointment?.branch.email}</p>
												</div>
											</div>
										</div> */}
                        <div className="container py-6">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Thông tin chi nhánh
                          </h3>
                          <div className="flex items-center space-x-4">
                            <img
                              src={`${selectedAppointment.branch?.picture_url}`}
                              alt="Branch Image"
                              className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                            />
                            <div>
                              <p className="text-gray-800 font-semibold">
                                {selectedAppointment.branch?.name}
                              </p>
                              <div className="text-gray-600 text-sm flex flex-row gap-2 items-center">
                                <img src={map} className="w-4 h-4" />
                                {selectedAppointment.branch?.address}
                              </div>
                              <div className="text-gray-600 text-sm flex flex-row gap-2 items-center">
                                <img src={mail} className="w-4 h-4" />
                                {selectedAppointment.branch?.email}
                              </div>
                              <div className="text-gray-600 text-sm flex flex-row gap-2 items-center">
                                <img src={phone} className="w-4 h-4" />
                                {selectedAppointment.branch?.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*----------------------- Button --------------------- */}
                        <div className="flex items-end justify-end w-full gap-2">
                          <button
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit"
                            onClick={handleAppointmentListHeader}
                          >
                            Quay lại
                          </button>
                          <button
                            className={`text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit
											${
                        selectedAppointment.status === "cancelled" ||
                        selectedAppointment.status === "completed"
                          ? "hidden"
                          : "block"
                      }`}
                            onClick={handleModal}
                          >
                            Hủy lịch
                          </button>

                          <button
                            className={`text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit
											${
                        selectedAppointment.status === "cancelled" ||
                        selectedAppointment.status === "completed"
                          ? "hidden"
                          : "block"
                      }`}
                            onClick={handleEditAppointment}
                          >
                            Đổi lịch
                          </button>

                          <button
                            className={`text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit
											${selectedAppointment.status !== "completed" ? "hidden" : "block"}`}
                            onClick={handleFeedbackButton}
                          >
                            {notHaveFeedback ? "Đánh giá" : "Xem đánh giá"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Modal
                    isOpen={showAlert}
                    title={"Hủy lịch"}
                    message="Bạn chắc chắn muốn hủy lịch hẹn này?"
                    onAccept={handleCancelAppointment}
                    onReject={() => setShowAlert(false)}
                  />
                </>
              )}
            </div>
            {/* ----------------------------------------------------Feedback---------------------------------------------------- */}
            <div
              className={`${
                showFeedback ? "block" : "hidden"
              } min-h-96 relative`}
            >
              {showFeedback && (
                <div className="bg-white flex flex-col rounded-lg shadow-md items-center justify-top w-full h-full">
                  <div className="relative flex flex-col items-start justify-top w-full h-full py-2 px-4 gap-3">
                    <div className="flex justify-between py-2 border-b-2 w-full">
                      <h2 className="text-xl font-semibold">
                        Đánh giá lịch hẹn #{selectedAppointment?.id}
                      </h2>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="feedback"
                      >
                        Đánh giá của bạn về chi nhánh
                      </label>
                      <Rating
                        initialRating={
                          selectedAppointment?.feedback?.branch_rating
                        }
                        onRatingChange={handleBranchRating}
                        changeable={notHaveFeedback}
                      />
                      {/* Branch feedback */}
                      <div
                        className={`flex flex-wrap justify-center items-center gap-2 `}
                      >
                        {(feedback?.branch_rating ?? 0) >= 4 ? (
                          <>
                            {goodBranchOptions.map((option) => (
                              <ChipCheckbox
                                key={option}
                                label={option}
                                checkable={notHaveFeedback}
                                checked={selectedBranchChips.includes(option)}
                                onChange={() => handleBranchChipChange(option)}
                              />
                            ))}
                          </>
                        ) : (
                          <>
                            {badBranchOptions.map((option) => (
                              <ChipCheckbox
                                key={option}
                                label={option}
                                checkable={notHaveFeedback}
                                checked={selectedBranchChips.includes(option)}
                                onChange={() => handleBranchChipChange(option)}
                              />
                            ))}
                          </>
                        )}
                      </div>

                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="feedback"
                      >
                        Đánh giá của bạn về nhân viên
                      </label>
                      <Rating
                        initialRating={
                          selectedAppointment?.feedback?.employee_rating
                        }
                        onRatingChange={handleEmployeeRating}
                        changeable={notHaveFeedback}
                      />
                      {/* Employee feedback */}
                      <div className="flex flex-wrap justify-center items-center gap-2">
                        {(feedback?.employee_rating ?? 0) >= 4 ? (
                          <>
                            {goodEmployeeOptions.map((option) => (
                              <ChipCheckbox
                                key={option}
                                label={option}
                                checkable={notHaveFeedback}
                                checked={selectedEmployeeChips.includes(option)}
                                onChange={() =>
                                  handleEmployeeChipChange(option)
                                }
                              />
                            ))}
                          </>
                        ) : (
                          <>
                            {badEmployeeOptions.map((option) => (
                              <ChipCheckbox
                                key={option}
                                label={option}
                                checkable={notHaveFeedback}
                                checked={selectedEmployeeChips.includes(option)}
                                onChange={() =>
                                  handleEmployeeChipChange(option)
                                }
                              />
                            ))}
                          </>
                        )}
                      </div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="feedback"
                      >
                        Đánh giá tổng thể lần hẹn này
                      </label>
                      <Rating
                        initialRating={
                          selectedAppointment?.feedback?.overall_rating
                        }
                        onRatingChange={handleOverallFeedback}
                        changeable={notHaveFeedback}
                      />
                      <div className="flex flex-col">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="feedback"
                        >
                          Nhận xét của bạn
                        </label>
                        <textarea
                          className="w-full h-20 max-h-20 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                          id="feedback"
                          name="feedback"
                          readOnly={!notHaveFeedback}
                          value={feedback?.suggestion}
                          onChange={(e) => setSuggestion(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="flex flex-row items-end w-full gap-2 justify-end py-3">
                        {notHaveFeedback ? (
                          <>
                            <button
                              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit"
                              onClick={() => {
                                setShowFeedback(false);
                                setShowDetails(true);
                                navigate(
                                  "/appointment?id=" + selectedAppointment?.id
                                );
                              }}
                            >
                              Hủy
                            </button>
                            <button
                              className={`text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit ${
                                validateFeedback()
                                  ? ""
                                  : "cursor-not-allowed opacity-50"
                              }`}
                              onClick={handleSubmitFeedback}
                            >
                              Gửi đánh giá
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded px-4 py-2 text-sm font-medium w-fit h-fit"
                              onClick={() => {
                                setShowFeedback(false);
                                setShowDetails(true);
                                navigate(
                                  "/appointment?id=" + selectedAppointment?.id
                                );
                              }}
                            >
                              Quay lại
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
