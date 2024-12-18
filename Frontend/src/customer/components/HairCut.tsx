import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Service {
  title: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Khai huyệt",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/1.png",
  },
  {
    title: "Rửa mặt & Massage mặt",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/2.png",
  },
  {
    title: "Hút mụn",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/3.png",
  },
  {
    title: "Phun Hoa Hồng",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/4.png",
  },
  {
    title: "Gội đầu & Massage đầu",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/5.png",
  },
  {
    title: "Rửa tai & Ngoáy tai",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/6.png",
  },
  {
    title: "Xối nước thác đổ",
    image:
      "https://storage.30shine.com/web/v4/images/cat-goi-combo/CutThuongGia/7.png",
  },
  {
    title: "Cắt tóc",
    image:
      "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=304,fit=crop,trim=748.8000000000001;0;316.8;0/mePnvZ15VEHy7n8p/phong-dWxbB07P2kf1aXLn.jpg",
  },
];

const HairCut: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const handleclick = () => {
    navigate("/booking");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-800 text-center mb-4">
        QUY TRÌNH DỊCH VỤ
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Dịch vụ Cắt Tóc Khoang Thương Gia - Mang đến trải nghiệm dịch vụ đỉnh
        cao lần đầu tiên xuất hiện tại Việt Nam
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div key={index} className="text-center">
            <img
              src={service.image}
              alt={service.title}
              className="rounded-lg shadow-lg mb-4 w-full h-48 object-cover"
            />
            <h3 className="font-semibold text-gray-800">{service.title}</h3>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700"
          onClick={handleclick}
        >
          ĐẶT LỊCH NGAY
        </button>
      </div>
    </div>
  );
};

export default HairCut;
