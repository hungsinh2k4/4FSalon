import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { getEmployees } from "../api/employees";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleLearnMore = () => {
    navigate("/servicesHairCut"); // Chuyển sang trang /services
  };
  const handleLearnMore2 = () => {
    navigate("/servicesCurlHair"); // Chuyển sang trang /services
  };
  const handleLearnMore3 = () => {
    navigate("/servicesHairDying"); // Chuyển sang trang /services
  };

  const stylistContainerRef = useRef<HTMLDivElement>(null);
  const [stylists, setStylists] = useState<any[]>([]);

  useEffect(() => {
    AOS.init({ once: true, duration: 1200 });
    window.scrollTo(0, 0);

    const fetchStylists = async () => {
      try {
        const response = await getEmployees();
        setStylists(response);
      } catch (error) {
        console.error("Error fetching stylists:", error);
      }
    };

    fetchStylists();
  }, []);

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
      className="bg-cover bg-top min-h-screen"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1621645582931-d1d3e6564943?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
    >
      {/* Main Content */}

      {/* <div
        className="flex flex-col items-center justify-center text-center py-64"
        data-aos="fade-up"
      >
        <h1 className="text-6xl font-bold text-white mb-2 ">4F SALON</h1>
        <div className="w-24 h-px bg-gray-300 my-4"></div>
        <p className="text-2xl font-semi-bold text-white">
          The best place for your best haircut
        </p>
      </div> */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/mePnvZ15VEHy7n8p/lkq_8164-YrDNq1ROv3u0q257.jpg')",
        }}
        data-aos="fade-up"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-6xl font-bold text-white mb-2">
          4F SALON
        </h1>
        <div className="relative w-24 h-px bg-gray-300 my-4"></div>
        <p className="relative text-2xl font-semi-bold text-white">
          The best place for your best haircut
        </p>
      </div>

      {/* Dịch Vụ */}
      <section className="py-12 bg-white min-w-screen">
        <h2 className="text-4xl font-bold text-center mb-8">Dịch vụ</h2>
        <div className="container w-3/4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center"
            // data-aos="fade-up"
          >
            <div
              className="overflow-hidden rounded-lg flex items-center justify-center"
              data-aos="fade-up"
            >
              <img
                src="https://assets.zyrosite.com/mePnvZ15VEHy7n8p/450613263_891765619633403_6662505036750197758_n-A1aJBEKQaji93D1x.jpg"
                alt="Cắt tóc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center" data-aos="fade-up">
              <h3 className="text-xl font-semibold mt-4">Cắt tóc</h3>
              <p
                className="text-blue-600 mt-2 cursor-pointer hover:underline"
                onClick={handleLearnMore}
              >
                Tìm hiểu thêm &gt;
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div
              className="overflow-hidden rounded-lg flex items-center justify-center"
              data-aos="fade-up"
            >
              <img
                src="https://assets.zyrosite.com/mePnvZ15VEHy7n8p/449384592_884027163740582_3894658124597652362_n-ALpo73JBMotXxKyQ.jpg"
                alt="Uốn tóc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center" data-aos="fade-up">
              <h3 className="text-xl font-semibold mt-4">Uốn tóc</h3>
              <p
                className="text-blue-600 mt-2 cursor-pointer hover:underline"
                onClick={handleLearnMore2}
              >
                Tìm hiểu thêm &gt;
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div
              className="overflow-hidden rounded-lg flex items-center justify-center"
              data-aos="fade-up"
            >
              <img
                src="https://assets.zyrosite.com/mePnvZ15VEHy7n8p/448353959_874397401370225_9111820804653780252_n-Yg29qnlL6JuvKpKZ.jpg"
                alt="Nhuộm tóc"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center" data-aos="fade-up">
              <h3 className="text-xl font-semibold mt-4">Nhuộm tóc</h3>
              <p
                className="text-blue-600 mt-2 cursor-pointer hover:underline"
                onClick={handleLearnMore3}
              >
                Tìm hiểu thêm &gt;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Khuyến mãi */}
      <div className="py-14">
        <div className="container mx-auto px-4" data-aos="fade-up">
          <h2 className="text-3xl font-semibold mb-4 text-white">Khuyến mãi</h2>
          <div className="bg-gray-800 rounded-lg p-7 flex flex-col md:flex-row items-center">
            {/* Ảnh */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-4" data-aos="fade-up">
              <img
                src="khuyenmai.png"
                alt="Khuyến mãi"
                className="rounded-lg object-cover"
              />
            </div>
            {/* Nội dung */}
            <div className="md:w-2/3 text-left" data-aos="fade-up">
              <h3 className="text-2xl font-semibold mb-2 text-white">
                Cơ hội nhận ưu đãi dịch vụ thông qua điểm thành viên
              </h3>
              <p className="mb-8 text-white">
                Tham gia ngay để tích điểm và hưởng nhiều ưu đãi độc quyền.
              </p>
              {/* <Link to="/booking" className="text-white mb-4">
                <button className="w-1/6 text-left bg-transparent border border-white px-1 text-white py-2 rounded hover:bg-white hover:text-gray-900 transition-colors">
                  Đặt lịch ngay
                </button>
              </Link> */}
              <Link
                to="/booking"
                className="text-gray-900 mb-4 border border-white p-4 bg-white hover:bg-gray-900 hover:text-white transition-colors"
                data-aos="fade-up"
              >
                Đặt lịch ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gặp gỡ các stylist */}

      <section className="py-12 bg-white" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-center mb-8">
          Gặp gỡ các stylist
        </h2>
        <div
          className="relative max-w-screen-lg w-full mx-auto overflow-hidden"
          data-aos="fade-up"
        >
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
          >
            <GoChevronLeft />
          </button>
          <div
            ref={stylistContainerRef}
            className="overflow-x-scroll flex space-x-8 scrollbar-hide"
          >
            <div className="flex space-x-8">
              {stylists.map((stylist) => (
                <div
                  key={stylist.id}
                  className="bg-gray-100 rounded-lg shadow-lg flex flex-col items-center"
                >
                  <div className="overflow-hidden h-32 w-32 sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
                    <img
                      src={
                        stylist.big_avatar_url
                          ? stylist.big_avatar_url
                          : "https://assets.zyrosite.com/mePnvZ15VEHy7n8p/canh-m5KbLrq72aU69ovZ.jpg"
                      }
                      alt={stylist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mt-4">
                      {stylist.name}
                    </h3>
                    <p className="text-gray-500 mt-2">{stylist.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
          >
            <GoChevronRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <div
        className="container mx-auto grid grid-cols-1 md:grid-cols-3"
        data-aos="fade-up"
      >
        {/* Cột trái */}
        <div
          className="bg-cover bg-right p-6 text-white flex flex-col justify-center"
          style={{ backgroundImage: "url('../assets/HomeImg/bottom.png')" }}
          data-aos="fade-right"
        >
          <h2 className="text-4xl font-bold">
            <span className="text-blue-500">20% </span>OFF
            <br />
            CHO LẦN ĐẶT LỊCH
            <br />
            ĐẦU TIÊN
          </h2>
          <p className="mt-8 font-bold text-white">
            CALL US:
            <br />
            XXX XXX XXXX
          </p>
        </div>

        {/* Cột giữa */}
        <div className="bg-gray-300 p-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">OUR STORY</h2>
          <img src="logo.png" alt="Barber Logo" className="w-24 h-24 mb-4" />
          <p className="mb-6" data-aos="fade-up">
            4F Salon – Nơi biến mái tóc thành ngôn ngữ của cá tính. Chúng tôi
            không chỉ cắt tóc, mà tạo nên phong cách. Đến với 4F Salon, bạn sẽ
            thấy sự khác biệt trong từng đường kéo, từng mái tóc. Hãy để chúng
            tôi giúp bạn tỏa sáng theo cách riêng của bạn.
          </p>
          <Link to="/booking" className="text-blue-500" data-aos="fade-up">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-gray-900 transition-colors">
              Đặt lịch ngay
            </button>
          </Link>
        </div>

        {/* Cột phải */}
        <div
          className="bg-cover bg-center p-8 text-white w-full h-full"
          style={{ backgroundImage: "url('../assets/HomeImg/Bg2.png')" }}
        >
          <div className="bg-gray-900 bg-opacity-80 text-white p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              LỊCH LÀM VIỆC
            </h2>
            <ul className="space-y-2 text-sm" data-aos="fade-up">
              {[
                "Thứ hai",
                "Thứ ba",
                "Thứ tư",
                "Thứ năm",
                "Thứ sáu",
                "Thứ bảy",
                "Chủ nhật",
              ].map((day, index) => (
                <li key={index} className="flex justify-between">
                  <span>{day}</span>
                  <span>8:00 - 21:00</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
