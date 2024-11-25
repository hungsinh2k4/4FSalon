import { useContext, useEffect, useState } from "react";
import { cancelAppointment, getAppointmentList, postFeedback } from "../api/user";
import { Feedback, MyAppointment } from "../utils/types";
import { useAuth } from "../context/AuthContext";
import { beautifyDate, beautifyPrice, beautifyStatus, beautifyTime } from "../utils/helpers";
import { FaAngleRight } from "react-icons/fa";

import Pagination from "../components/Pagination";

import Rating from "../components/Rating";
import ChipCheckbox from "../components/ChipCheckbox";
import Modal from "../components/Modal";

const goodBranchOptions = ['Sạch sẽ', 'Dễ tìm', 'Nhân viên thân thiện', 'Dịch vụ tốt', 'Giá cả hợp lý'];
const badBranchOptions = ['Không sạch sẽ', 'Khó tìm', 'Nhân viên không thân thiện', 'Dịch vụ không tốt', 'Giá cả không hợp lý'];
const goodEmployeeOptions = ['Nhiệt tình', 'Nhanh nhẹn', 'Kỹ năng tốt', 'Tận tâm', 'Thân thiện'];
const badEmployeeOptions = ['Không nhiệt tình', 'Chậm chạp', 'Kỹ năng không tốt', 'Không tận tâm', 'Không thân thiện'];

const pageSlice = 5;

const Appointment = () => { 
	const [loading, setLoading] = useState(false);
	const [appointmentList, setAppointmentList] = useState<MyAppointment[]>([]);
	const [page, setPage] = useState<number>(1);

	const [showDetails, setShowDetails] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<MyAppointment | null>(null);

	const [feedback, setFeedback] = useState<Partial<Feedback> | null>(null);
	const [selectedBranchChips, setSelectedBranchChips] = useState<string[]>([]);
	const [selectedEmployeeChips, setSelectedEmployeeChips] = useState<string[]>([]);
	const [suggestion, setSuggestion] = useState('');

	const [showAlert, setShowAlert] = useState(false);

	const { user } = useAuth();

	const handleBranchChipChange = (label: string) => {
		setSelectedBranchChips((prevSelectedChips) =>
		prevSelectedChips.includes(label)
			? prevSelectedChips.filter((chip) => chip !== label)
			: [...prevSelectedChips, label]
		);
	}

	const handleEmployeeChipChange = (label: string) => {
		setSelectedEmployeeChips((prevSelectedChips) =>
		prevSelectedChips.includes(label)
			? prevSelectedChips.filter((chip) => chip !== label)
			: [...prevSelectedChips, label]
		);
	}

	const clearBranchChips = () => {
		setSelectedBranchChips([]);
	}

	const clearEmployeeChips = () => {
		setSelectedEmployeeChips([]);
	}

	useEffect(() => {
		setLoading(true);
		const loadAppointmentList = async () => {
			try {
				const data = await getAppointmentList(`customer_id=${user?.id}&have_feedback=true&order=desc`);
				setAppointmentList(data);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		};
		loadAppointmentList();
	}, []);

	const handleStatusColor = (status: string) => {
		let m_status = beautifyStatus(status);
		switch (m_status) {
			case 'Completed':
				return 'bg-green-600';
			case 'Pending':
				return 'bg-yellow-600';
			case 'Cancelled':
				return 'bg-red-600';
			case 'Confirmed':
				return 'bg-blue-600';
			default:
				return 'bg-gray-600';
		}
	}

	const handleStatusDisplay = (status: string) => {
		let m_status = beautifyStatus(status);
		switch (m_status) {
			case 'Completed':
				return 'Hoàn thành';
			case 'Pending':
				return 'Chờ xác nhận';
			case 'Cancelled':
				return 'Đã hủy';
			case 'Confirmed':
				return 'Đã xác nhận';
			default:
				return 'Không xác định';
		}
	}

	const handleDetailButton = (appointment: MyAppointment) => {
		setSelectedAppointment(appointment);
		if (appointment.status === 'completed') {
			setFeedback(appointment.feedback);
		}
		setShowDetails(true);
		clearBranchChips();
		clearEmployeeChips();
	}

	const handleCancelAppointment = async () => {
		if (selectedAppointment && selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed') {
			try {
				const modifiedAppointment = {...selectedAppointment, status: 'cancelled'};
				await cancelAppointment(modifiedAppointment);
				setSelectedAppointment({...selectedAppointment, status: 'cancelled'});
				setShowAlert(false);
			} catch (err) {
				console.log(err);
			}
		}
	}

	const handleAppointmentListHeader = () => {
		setSelectedAppointment(null);
		setShowDetails(false);
		setShowFeedback(false);
	}

	const handleDetailHeader = () => {
		if (selectedAppointment) {
			setShowDetails(true);
			setShowFeedback(false);
		}
	}

	const handleFeedbackButton = () => {
		if (selectedAppointment && selectedAppointment.status === 'completed') {
			setShowDetails(false);
			console.log(selectedAppointment.feedback);
			if (selectedAppointment.feedback) {
				setFeedback(selectedAppointment.feedback);
				if (selectedAppointment.feedback.branch_feedback) {
					setSelectedBranchChips(selectedAppointment.feedback.branch_feedback.split(', '));
				}
				if (selectedAppointment.feedback.employee_feedback) {
					setSelectedEmployeeChips(selectedAppointment.feedback.employee_feedback.split(', '));
				}
			} else {
				setFeedback({
					id: 0,
					branch_rating: 0,
					branch_feedback: '',
					employee_rating: 0,
					employee_feedback: '',
					overall_rating: 0,
					appointment_id: selectedAppointment.id
				});
				selectedAppointment.feedback = feedback as Feedback;
			}
			setShowFeedback(true);
		}
	}

	const handleBranchRating = (rating: number) => {
		const prevRating = feedback?.branch_rating ?? 0;
		if ((rating < 4 && prevRating >= 4) || (rating >= 4 && prevRating < 4)) {
			clearBranchChips();
		}
		setFeedback(feedback && {...feedback, branch_rating: rating});
	}

	const handleEmployeeRating = (rating: number) => {
		const prevRating = feedback?.employee_rating ?? 0;
		if ((rating < 4 && prevRating >= 4) || (rating >= 4 && prevRating < 4)) {
			clearEmployeeChips();
		}
		setFeedback(feedback && {...feedback, employee_rating: rating});
	}

	const handleOverallFeedback = (rating: number) => {
		setFeedback(feedback && {...feedback, overall_rating: rating});
	}

	const validateFeedback = () => {
		if (feedback) {
			if (feedback.branch_rating === 0 || feedback.employee_rating === 0 || feedback.overall_rating === 0) {
				return false;
			}
			return true;
		}
		return false;
	}

	const handleSubmit = async () => {
		if (feedback && feedback.id === 0) {
			if (selectedBranchChips.length !== 0) {
				feedback.branch_feedback = selectedBranchChips.join(', ');
			} else {
				delete feedback.branch_feedback;
			}
			if (selectedEmployeeChips.length !== 0) {
				feedback.employee_feedback = selectedEmployeeChips.join(', ');
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

			} catch (err) {
				console.log(err);
			}
		} else {
			console.log('Cannot submit feedback');
		}
	}

	const handle = () => {
		setShowAlert(true);
		console.log(showAlert);
	}

	return (
		<div className={`relative flex min-h-screen flex-col justify-top items-center overflow-hidden bg-gray-50 py-6 sm:py-12 `}>
			<div className="relative bg-white px-4 pt-8 pb-6 shadow-xl ring-1 ring-gray-900/5 sm:ml-0 w-full max-w-4xl mx-10 sm:rounded-lg sm:px-10 overflow-auto overscroll-auto">
				<div>
					<h1 className="text-2xl font-bold text-center mb-6">Lịch hẹn của bạn</h1>
					<div className="flex flex-row justify-start align-middle border-b-2 mb-3">
						<div className="font-bold hover:underline cursor-pointer" 
						onClick={() => handleAppointmentListHeader()
						}>Danh sách lịch hẹn</div>
						<div className={`flex flex-row justify-start align-middle ${showDetails || showFeedback ? 'block' : 'hidden'}`}
						onClick={() => handleDetailHeader()}
						>
							<FaAngleRight className="text-2xl mx-2" />
							<div className={`font-bold hover:underline cursor-pointer`}>Lịch hẹn #{selectedAppointment !== null ? selectedAppointment.id : ''}</div>
						</div>
						<div className={`flex flex-row justify-start align-middle ${showFeedback ? 'block' : 'hidden'}`}>
							<FaAngleRight className="text-2xl mx-2" />
							<div className="font-bold hover:underline cursor-pointer">Đánh giá</div>
						</div>
					</div>
					{loading && 
					<div className="flex items-center justify-center">
						<button type="button" className="inline-flex items-center h-12 w-48 px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-300 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed" disabled>
							<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacitxy-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Loading...
						</button>
					</div>
					}
					<div className="relative min-h-full">
						{/* List */}
						<div className={`${!showDetails && !showFeedback ? 'block' : 'hidden'} space-y-4`}>
						{appointmentList.slice((page-1)*pageSlice, (page-1)*pageSlice + pageSlice).map((appointment) => (
							<div key={appointment.id} className={`bg-gray-100 p-4 rounded-lg shadow-md`}>
								<div className="flex justify-between py-2 border-b-2">
									<h2 className="text-xl font-semibold">Lịch hẹn #{appointment.id}</h2>
									<div className={`rounded-md px-2 py-1 align-middle justify-center ${handleStatusColor(appointment.status)}`}>
										<p className="text-sm font-medium text-white">{handleStatusDisplay(appointment.status)}</p>
									</div>
								</div>    
								<p className="text-gray-600">Dịch vụ: {appointment.service.name}</p>
								<p className="text-gray-600">Ngày hẹn: {beautifyDate(appointment.date)}</p>
								<p className="text-gray-600">Bắt đầu: {beautifyTime(appointment.start_time)}</p>
								<p className="text-gray-600">Địa chỉ: {appointment.branch.address}</p>
								<p className="text-gray-600">Thanh toán: {beautifyPrice(appointment.final_price)}</p>
								<div className="flex justify-end">
									<button className="px-2 py-1 bg-blue-500 hover:opacity-80 text-white rounded-lg text-wrap w-24"
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
							onChangePage={(page: number) => {setPage(page); window.scrollTo(0, 0)}} 
						/>
						</div>
						{/* Detail */}
						<div className={`${showDetails ? 'block' : 'hidden'} min-h-96 relative`}>
							{showDetails && (
								<>
								<div className="bg-white flex flex-col rounded-lg shadow-md items-center justify-top w-full h-full">
									{selectedAppointment !== null && (
									<div className="relative flex flex-col items-start justify-top w-full h-full py-2 px-4 gap-3">
										<div className="flex justify-between py-2 border-b-2 w-full">
											<h2 className="text-xl font-semibold">Lịch hẹn #{selectedAppointment.id}</h2>
											<div className={`rounded-md px-2 py-1 align-middle justify-center ${handleStatusColor(selectedAppointment.status)}`}>
												<p className="text-sm font-medium text-white">{handleStatusDisplay(selectedAppointment?.status)}</p>
											</div>
										</div>  
										<div className="flex w-full">
											<div className="flex flex-col w-3/5 h-100 gap-1 mt-2">
												<p className="font-bold">Chi tiết lịch hẹn</p>
												<p className="text-gray-600">Dịch vụ: {selectedAppointment?.service.name}</p>
												<p className="text-gray-600">Ngày hẹn: {beautifyDate(selectedAppointment?.date)}</p>
												<p className="text-gray-600">Bắt đầu: {beautifyTime(selectedAppointment?.start_time)}</p>
												<p className="text-gray-600">Kết thúc: {beautifyTime(selectedAppointment?.estimated_end_time)}</p>
												<p className="text-gray-600">Thanh toán: {beautifyPrice(selectedAppointment?.final_price)}</p>
												<p className="text-gray-600">Thời gian đặt lịch: {beautifyTime(selectedAppointment?.created_at)} {beautifyDate(selectedAppointment.created_at)}</p>
											</div>
											<div className="flex flex-col h-100 gap-1 mt-2">
												<p className="font-bold">Nhân viên phục vụ</p>
												<div className="flex gap-2 items-center border border-solid border-teal-700 rounded-3xl px-1 py-1">
													<img src={selectedAppointment?.employee?.picture_url ?? ''} alt="" className="w-10 h-10 rounded-full" />
													<p className="text-gray-600">{selectedAppointment?.employee?.name}</p>
												</div>
												<p className="text-gray-600">Email: {selectedAppointment?.employee?.email}</p>
												<p className="text-gray-600">Số điện thoại: {selectedAppointment?.employee?.phone}</p>
											</div>
										</div>
										<div className="flex flex-col">
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
										</div>
										<div className="flex items-end justify-end w-full">
											<button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-24" onClick={handleAppointmentListHeader}>
												Quay lại
											</button>
											<button className={`px-4 py-2 bg-red-500 text-white rounded-lg ml-4 w-24 
											${
												selectedAppointment.status === 'cancelled' || 
												selectedAppointment.status === 'completed'  ? 'hidden' : 'block'
											}`}
											onClick={handle}
											>
												Hủy lịch
											</button>
											<button className={`px-4 py-2 bg-yellow-500 text-white rounded-lg ml-4 w-fit 
											${
												selectedAppointment.status !== 'completed' ? 'hidden' : 'block'
												}`}
												onClick={handleFeedbackButton}
											>
												{feedback?.id === 0 ? 'Đánh giá' : 'Xem đánh giá'}
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
						{/* Feedback */}
						<div className={`${showFeedback ? 'block' : 'hidden'} min-h-96 relative`}>
							{showFeedback && (
								<div className="bg-white flex flex-col rounded-lg shadow-md items-center justify-top w-full h-full">
									<div className="relative flex flex-col items-start justify-top w-full h-full py-2 px-4 gap-3">
										<div className="flex justify-between py-2 border-b-2 w-full">
											<h2 className="text-xl font-semibold">Đánh giá lịch hẹn #{selectedAppointment?.id}</h2>
										</div>  
										<div className="w-full flex flex-col gap-2">
											<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedback">Đánh giá của bạn về chi nhánh</label>
											<Rating initialRating={selectedAppointment?.feedback?.branch_rating} 
													onRatingChange={handleBranchRating}/>
											{/* Branch feedback */}
											<div className={`flex flex-wrap justify-center items-center gap-2 `}>
												{((feedback?.branch_rating ?? 0) >= 4) ? (
													<>
														{goodBranchOptions.map((option) => (
															<ChipCheckbox
																key={option}
																label={option}
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
																checked={selectedBranchChips.includes(option)}
																onChange={() => handleBranchChipChange(option)}
															/>
														))}
													</>
												)}
											</div>
											
											<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedback">Đánh giá của bạn về nhân viên</label>
											<Rating initialRating={selectedAppointment?.feedback?.employee_rating}
												onRatingChange={handleEmployeeRating}/>
											{/* Employee feedback */}
											<div className="flex flex-wrap justify-center items-center gap-2">
												{((feedback?.employee_rating ?? 0) >= 4) ? (
													<>
														{goodEmployeeOptions.map((option) => (
															<ChipCheckbox
																key={option}
																label={option}
																checked={selectedEmployeeChips.includes(option)}
																onChange={() => handleEmployeeChipChange(option)}
															/>
														))}
													</>
												) : (
													<>
														{badEmployeeOptions.map((option) => (
															<ChipCheckbox
																key={option}
																label={option}
																checked={selectedEmployeeChips.includes(option)}
																onChange={() => handleEmployeeChipChange(option)}
															/>
														))}
													</>
												)
												}
											</div>
											<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedback">Đánh giá tổng thể lần hẹn này</label>
											<Rating initialRating={selectedAppointment?.feedback?.overall_rating}
												onRatingChange={handleOverallFeedback}/>
											<div className="flex flex-col">
												<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedback">Nhận xét của bạn</label>
												<textarea
													className="w-full h-20 max-h-20 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
													id="feedback"
													name="feedback"
													value={feedback?.suggestion}
													onChange={(e) => setSuggestion(e.target.value)}
												></textarea>
											</div>
											<div className="flex flex-row items-end w-full gap-1 justify-end py-3">
												{feedback?.id === 0 ? (
												<>
													<button className="px-2 py-1 bg-blue-500 text-white rounded-lg w-fit self-end"
														onClick={() => {setShowFeedback(false); setShowDetails(true)}}
													>
														Hủy
													</button>
													<button className={`px-2 py-1 bg-blue-500 text-white rounded-lg w-fit self-end ${
														validateFeedback() ? '' : 'cursor-not-allowed opacity-50'
													}`}
														onClick={handleSubmit}
													>
														Gửi đánh giá
													</button>
												</>
												) : (
												<>
													<button className="px-2 py-1 bg-blue-500 text-white rounded-lg w-fit self-end"
														onClick={() => {setShowFeedback(false); setShowDetails(true)}}
													>
														Quay lại
													</button>
												</>
												)
												}
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