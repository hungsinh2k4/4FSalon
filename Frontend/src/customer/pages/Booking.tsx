import React from "react";
import location_logo from "../assets/Booking/location.png";

const Booking: React.FC = () => {

    return (

        <div
            className="bg-cover bg-center min-h-screen flex flex-col items-center"
            style={{ backgroundImage: `url('/src/customer/assets/bg.png')` }}
        >
            <div className="w-full text-xl font-semibold text-white text-center pt-8">Đặt lịch hẹn</div>
            <div className="bg-white w-11/12 h-[48rem] my-4 rounded-lg flex flex-row">
                <div >

                    <ol className="ml-8 mt-8 list-decimal list-inside font-semibold text-3xl">
                        <li className="mb-4">
                            Chọn chi nhánh
                            <button className="flex content-start rounded-lg w-[37rem] bg-gray-200 p-4 mt-4 font-normal text-sm text-center">
                                <img src={location_logo} alt="location-icon" className="w-5 h-5 mr-2" />
                                Chọn địa chỉ chi nhánh
                            </button>
                            <button className="flex rounded-lg w-[13rem] bg-gray-200 p-4 mt-2 font-normal text-sm ">
                                <img src={location_logo} alt="location-icon" className="w-5 h-5 mr-2" />
                                <div>Tìm chi nhánh gần nhất</div>

                            </button>
                        </li>
                        <li>
                            Chọn dịch vụ
                        </li>
                        <li>
                            Chọn ngày, giờ & nhân viên
                        </li>
                    </ol>
                </div>
                <div></div>
            </div>
        </div>


    )
}

export default Booking