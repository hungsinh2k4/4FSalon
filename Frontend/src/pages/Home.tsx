import React, { useRef } from "react";
import HairCut from "/src/assets/Home Img/HairCut.png";
import Service2 from "/src/assets/Home Img/Service2.png";
import Service3 from "/src/assets/Home Img/Service3.png";
import Khuyenmai from "/src/assets/Home Img/Khuyenmai.png";
import Stylist1 from "/src/assets/Home Img/Stylist1.png";
import Stylist2 from "/src/assets/Home Img/Stylist2.png";
import Stylist3 from "/src/assets/Home Img/Stylist3.png";
import Stylist4 from "/src/assets/Home Img/Stylist4.png";
import Stylist5 from "/src/assets/Home Img/Stylist5.png";

const Home: React.FC = () => {
  const stylistContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (stylistContainerRef.current) {
      stylistContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (stylistContainerRef.current) {
      stylistContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

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

      {/* Gặp gỡ các stylist */}

      <section className="py-12 bg-white">
        <h2 className="text-4xl font-bold text-center mb-8">
          Gặp gỡ các stylist
        </h2>
        <div className="relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &lt;
          </button>
          <div
            ref={stylistContainerRef}
            className="container mx-auto overflow-x-scroll flex space-x-8"
          >
            <div className="flex space-x-8">
              <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
                <div className="overflow-hidden rounded-full h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                  <img
                    src={Stylist1}
                    alt="Stylist 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold mt-4">Stylist 1</h3>
                  <p className="text-gray-500 mt-2">Chuyên gia cắt tóc</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
                <div className="overflow-hidden rounded-full h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                  <img
                    src={Stylist2}
                    alt="Stylist 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold mt-4">Stylist 2</h3>
                  <p className="text-gray-500 mt-2">Chuyên gia uốn tóc</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
                <div className="overflow-hidden rounded-full h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                  <img
                    src={Stylist3}
                    alt="Stylist 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold mt-4">Stylist 3</h3>
                  <p className="text-gray-500 mt-2">Chuyên gia nhuộm tóc</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
                <div className="overflow-hidden rounded-full h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                  <img
                    src={Stylist4}
                    alt="Stylist 4"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold mt-4">Stylist 4</h3>
                  <p className="text-gray-500 mt-2">Chuyên gia tạo kiểu</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
                <div className="overflow-hidden rounded-full h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                  <img
                    src={Stylist4}
                    alt="Stylist 4"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold mt-4">Stylist 5</h3>
                  <p className="text-gray-500 mt-2">Chuyên gia tạo kiểu</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
              <div className="overflow-hidden rounded-full h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                <img
                  src={Stylist4}
                  alt="Stylist 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold mt-4">Stylist 6</h3>
                <p className="text-gray-500 mt-2">Chuyên gia tạo kiểu</p>
              </div>
            </div>
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
          >
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
