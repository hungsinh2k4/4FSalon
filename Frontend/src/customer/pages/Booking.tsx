import React from "react";
import location_logo from "../assets/Booking/location.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCity, faLocationDot, faScissors, faSearch, faTicket, faUserCheck } from "@fortawesome/free-solid-svg-icons";

const Booking: React.FC = () => {

        return (

    <div className="min-h-screen bg-cover bg-no-repeat pb-10" 
        style={{ backgroundImage: `url('/src/customer/assets/bg.png')` }}>
        
        
        <div className=" pt-10">
            <h1 className="text-3xl font-bold text-center text-white pb-2">Đặt lịch hẹn</h1>
        </div>

        <div className="m-10 mt-0 flex justify-between bg-white rounded-lg p-10 pb-15 space-x-10">
            
            {/* Phần bên trái */}
            <div className="w-full ">
                {/* Chọn chi nhánh */}
                <div className="mb-6">
                <h2 className="text-3xl font-bold mb-1">1. Chọn chi nhánh</h2>
                <div className="flex items-center">
                     <button className="px-2 py-2 border rounded-lg mt-8 w-full text-left bg-gray-200  hover:bg-blue-500">
                     <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                        Chọn địa chỉ chi nhánh </button>
                </div>
                <button className="inline-block px-2 py-2 border rounded-lg mt-4 w-fit bg-gray-200  hover:bg-blue-500">
                    <FontAwesomeIcon icon={faCity} className="mr-2" />
                    Tìm chi nhánh gần nhất</button>
                </div> 
                
                {/* Chọn dịch vụ */} 
                <div className="mb-6">
                <h2 className="text-3xl font-bold mb-1">2. Chọn dịch vụ</h2>
                <div className="flex items-center">
                    <button className="px-2 py-2 border rounded-lg mt-8 w-full text-left bg-gray-200  hover:bg-blue-500">
                        <FontAwesomeIcon icon={faScissors} className="mr-2" />
                        Chọn dịch vụ với nhiều ưu đãi hấp dẫn</button>
                 </div>
                <button className="inline-block px-2 py-2 border rounded-lg mt-4 bg-gray-200 w-fit hover:bg-blue-500">
                    <FontAwesomeIcon icon={faTicket} className="mr-2" />Voucher</button>
                </div> 
                {/* Chọn ngày, giờ & nhân viên */}
                <div>
                     <h2 className="text-3xl font-bold mb-1">2. Chọn ngày giờ & nhân viên</h2>
                     <div className="flex items-center pb-4">
                    <button className="inline-block px-2 py-2 border rounded-lg mt-4 w-fit bg-gray-200 hover:bg-blue-500">
                        <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                        Chọn nhân viên</button>
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
                        {['7:00', '8:00', '9:00', '10:00', '11:00', '13:00', '14:00',
                        '7:20', '8:20', '9:20', '10:20', '11:20', '13:20', '14:20',
                        '7:40', '8:40', '9:40', '10:40', '11:40', '13:40', '14:40']
                        .map((time, index) => (
                            <button key={index} className="p-2 bg-gray-300 rounded-lg text-center hover:bg-gray-400">
                            {time}
                            </button>
                        ))}
                    </div>
                </div>
                
                <button className="mt-6 w-full p-3 bg-blue-500 text-white rounded-lg">Xác nhận lịch hẹn</button>
                </div>
            
            
            {/* Phần bên phải */}
            <div className="w-full">
                <div className="relative">
                <input 
                type="text" 
                placeholder="Tìm kiếm chi nhánh"
                className="w-full p-3 pl-9 mb-6 rounded-lg border-2 border-black"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute top-5   left-4 text-gray-500 font-bold" />
                <div>
                    {[1, 2, 3, 4].map((branch) => (
                    <div key={branch} className="flex mb-4 p-4 bg-white rounded-lg shadow-lg">
                        <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                        <div className="ml-4">
                        <h3 className="text-lg font-semibold">Tên Chi Nhánh {branch}</h3>
                        <p className="text-gray-500">xx đường XXXXXX, Huyện XXXX, Thành phố XXXXX</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            </div>
            </div>
    </div>
  );
};

export default Booking