import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMapGL from '@goongmaps/goong-map-react';
import '@goongmaps/goong-js/dist/goong-js.css';
import Map from "../components/Map";


interface Branch {
  id: number;
  address: string;
  lat: number;
  long: number;
  image: string;
}

interface Position {
  lat: number;
  lng: number;
}

const FindNearestShop: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const localMap =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8610911880523!2d105.78010407448126!3d21.038243387454255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313a3bfdc4f37!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4csIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1734362828753!5m2!1svi!2s";

  // Fetch danh sách chi nhánh
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          "https://fourfsalonserver.onrender.com/api/branches"
        );
        
        setBranches(response.data);
        setFilteredBranches(response.data);
        setSelectedBranch(response.data[0]);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  // Lọc chi nhánh theo thành phố và quận/huyện
  useEffect(() => {
    const filtered = branches.filter((branch) => {
      return (
        (!city || branch.address.includes(city)) &&
        (!district || branch.address.includes(district))
      );
    });
    setFilteredBranches(filtered);
  }, [city, district, branches]);

  const handleBooking = (branch: Branch) => {
    navigate(`/booking?branch_id=${branch.id}`);
  }

  const findNearestBranch = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentPosition: Position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      let minDistance = Number.MAX_SAFE_INTEGER;
      let nearestBranch: Branch | null = null;

      branches.forEach((branch) => {
        const distance = Math.sqrt(
          (branch.lat - currentPosition.lat) ** 2 +
            (branch.long - currentPosition.lng) ** 2
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestBranch = branch;
        }
      });

      if (nearestBranch) {
        setSelectedBranch(nearestBranch);
      }
    });
  }

  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <div className="w-3/4 bg-white p-4 rounded shadow-md">
        <div className="flex flex-col md:flex-row gap-4 h-full">
          {/* Cột bên trái: Tìm Salon Gần Nhất */}
          <div className="w-full md:w-1/2 p-4 flex flex-col">
            <h1 className="text-xl font-semibold mb-4 bg-blue-900 text-center text-white p-2 rounded hover:bg-blue-800 cursor-pointer" 
            onClick={findNearestBranch}
            >
              TÌM SALON GẦN ANH
            </h1>
            <div className="overflow-y-auto flex-1 border rounded p-4 border-gray-200 border-solid max-h-[530px]">
              {selectedBranch && (
                <>
                <label className="text-sm text-gray-500">Đang xem</label>
                <div className="flex items-center mb-4 p-4 border rounded hover:bg-gray-50">
                  <img
                    src={
                      selectedBranch.image
                        ? selectedBranch.image
                        : "https://media.licdn.com/dms/image/v2/D560BAQG8v1rzcEkGlQ/company-logo_200_200/company-logo_200_200/0/1689257900736/branch_metrics_logo?e=2147483647&v=beta&t=jsEr5o4XivwCgispjT_SyXMCED2QqtVl5Pa_qA8Zvxo"
                    }
                    alt="Salon"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold">{selectedBranch.address}</p>
                    <div className="flex mt-2 space-x-2">
                      <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer"
                      onClick={() => handleBooking(selectedBranch)}
                      >
                        📅 Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
                </>
                )}
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="flex items-center mb-4 p-4 border rounded hover:bg-gray-50"
                >
                  <img
                    src={
                      branch.image
                        ? branch.image
                        : "https://media.licdn.com/dms/image/v2/D560BAQG8v1rzcEkGlQ/company-logo_200_200/company-logo_200_200/0/1689257900736/branch_metrics_logo?e=2147483647&v=beta&t=jsEr5o4XivwCgispjT_SyXMCED2QqtVl5Pa_qA8Zvxo"
                    }
                    alt="Salon"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold">{branch.address}</p>
                    <div className="flex mt-2 space-x-2">
                      <button 
                      className="bg-green-500 text-white px-3 py-2 rounded text-xs cursor-pointer"
                      onClick={() => setSelectedBranch(branch)}
                      >
                        Xem vị trí
                      </button>
                      <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs cursor-pointer"
                      onClick={() => handleBooking(branch)}
                      >
                        📅 Đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột bên phải: Filter + Map */}
          <div className="w-full md:w-1/2 flex flex-col gap-1">
            <div className="p-4 rounded">
              <div className="flex space-x-4">
                {/* Dropdown Chọn Thành phố */}
                <select
                  className="p-2 rounded text-gray-700 flex-1"
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Tỉnh/Thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
                {/* Dropdown Quận/Huyện */}
                <select
                  className="p-2 rounded text-gray-700 flex-1"
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Quận huyện</option>
                  <option value="Ba Đình">Ba Đình</option>
                  <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                  <option value="Cầu Giấy">Cầu Giấy</option>
                  <option value="Hai Bà Trưng">Hai Bà Trưng</option>
                </select>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded shadow-md overflow-hidden">
              {selectedBranch && (
                <Map lat={Number(selectedBranch.lat)} long={Number(selectedBranch.long)} title={selectedBranch.address} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindNearestShop;
