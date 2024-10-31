import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import HairCut from "../assets/HomeImg/HairCut.png";
import Service3 from "../assets/HomeImg/Service3.png";
import Service2 from "./path-to-image/service2.jpg";


export default function ServicesCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <section className="py-12 bg-white min-w-screen">
      <h2 className="text-4xl font-bold text-center mb-8">Dịch vụ</h2>
      <div className="container w-3/4 mx-auto">
        <Slider {...settings}>
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
        </Slider>
      </div>
    </section>
  );
}
