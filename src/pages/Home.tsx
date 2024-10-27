import React from "react";
import HairCut from "/src/assets/Home Img/HairCut.png";
import Service2 from "/src/assets/Home Img/Service2.png";
import Service3 from "/src/assets/Home Img/Service3.png";
import Khuyenmai from "/src/assets/Home Img/Khuyenmai.png";
const Home: React.FC = () => {
  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url('/src/assets/bg.png')` }}
    >
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center py-32">
        <h1 className="text-6xl font-bold text-white mb-4">4F SALON</h1>
        <p className="text-2xl text-white">
          The best place for your best haircut
        </p>
      </div>

      <section className="py-12 bg-white min-w-screen">
        <h2 className="text-4xl font-bold text-center mb-8">Dịch vụ</h2>
        <div className="container w-3/4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div className="overflow-hidden rounded-lg flex items-center justify-center">
              <img
                src={HairCut}
                alt="Cắt tóc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mt-4">Cắt tóc</h3>
              <p className="text-gray-500 mt-2">Tìm hiểu thêm &gt;</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div className="overflow-hidden rounded-lg flex items-center justify-center">
              <img
                src={Service2}
                alt="Uốn tóc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mt-4">Uốn tóc</h3>
              <p className="text-gray-500 mt-2">Tìm hiểu thêm &gt;</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div className="overflow-hidden rounded-lg flex items-center justify-center">
              <img
                src={Service3}
                alt="Nhuộm tóc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mt-4">Nhuộm tóc</h3>
              <p className="text-gray-500 mt-2">Tìm hiểu thêm &gt;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Khuyến mãi */}
      <div className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Khuyến mãi</h2>
          <div className="bg-gray-800 rounded-lg p-7 flex flex-col md:flex-row items-center">
            {/* Ảnh */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-4">
              <img
                src={Khuyenmai}
                alt="Khuyến mãi"
                className="rounded-lg object-cover"
              />
            </div>
            {/* Nội dung */}
            <div className="md:w-2/3 text-left">
              <h3 className="text-2xl font-semibold mb-2 text-white">
                Cơ hội nhận ưu đãi dịch vụ thông qua điểm thành viên
              </h3>
              <p className="mb-4 text-white">
                Tham gia ngay để tích điểm và hưởng nhiều ưu đãi độc quyền.
              </p>
              <button className="bg-transparent border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-gray-900 transition-colors">
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
