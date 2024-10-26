import React from "react";
import bg from "/src/assets/bg.png";
import HairCut from "/src/assets/Home Img/HairCut.png";
import Service2 from "/src/assets/Home Img/Service2.png";
import Service3 from "/src/assets/Home Img/Service3.png";
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

      <section className="py-12 bg-white">
        <h2 className="text-4xl font-bold text-center mb-8">Dịch vụ</h2>
        <div className="container w-3/4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div className="overflow-hidden rounded-lg h-80 w-80 flex items-center justify-center">
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
            <div className="overflow-hidden rounded-lg h-80 w-80 flex items-center justify-center">
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
            <div className="overflow-hidden rounded-lg h-80 w-80 flex items-center justify-center">
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
      <section className="bg-black text-white py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src="/path-to-promotion-image.jpg"
              alt="Khuyến mãi"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">
              Cơ hội nhận ưu đãi dịch vụ thông qua điểm thành viên
            </h2>
            <p className="text-lg mb-4">
              Đặt lịch ngay để tận hưởng ưu đãi thành viên đặc biệt của chúng
              tôi.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-lg">
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
