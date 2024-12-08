import React, { useEffect, useState } from "react";
import axios from "axios";

interface Branch {
  id: number;
  address: string;
}

const FindNearestShop: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [city, setCity] = useState<string>(""); // State cho Tỉnh/Thành phố
  const [district, setDistrict] = useState<string>(""); // State cho Quận/Huyện
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Gọi API để lấy danh sách chi nhánh
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Branch[]>(
          "https://fourfsalonserver.onrender.com/api/branches"
        );
        setBranches(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location:", position.coords.longitude);
          console.log("Latitude:", position.coords.latitude);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // const mapSrc = userLocation
  //   ? `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${userLocation.lat},${userLocation.lng}&zoom=14`
  //   : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153169!3d-37.8162797797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1b6c5b0b1b!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1611816753437!5m2!1sen!2sau";

  // https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d59560.39379574732!2d105.78015856645648!3d21.09164105584376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d21.1461623!2d105.8620641!4m5!1s0x313454caaf2b115f%3A0xc05b77c8a5f461ae!2zxJDhuqFpIGjhu41jIFF14buRYyBnaWEgSMOgIE7hu5lpLCBE4buLY2ggVuG7jW5nIEjhuq11LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!3m2!1d21.0376807!2d105.78230459999999!5e0!3m2!1svi!2s!4v1733225343334!5m2!1svi!2s
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1062394589917!2d105.77569377448096!3d21.02843468779125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b2f431c099%3A0xe44043bacd461128!2zQuG6v24gWGUgTeG7uSDEkMOsbmg!5e0!3m2!1svi!2s!4v1733225564490!5m2!1svi!2s";

  // Lọc danh sách chi nhánh theo Tỉnh/Thành phố và Quận/Huyện
  const filteredBranches = branches.filter((branch) => {
    if (city && !branch.address.includes(city)) return false;
    if (district && !branch.address.includes(district)) return false;
    return true;
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/customer/assets/bg.png')" }} // Đường dẫn đến ảnh nền
    >
      <div className="max-w-7xl w-full mx-auto p-6 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          TÌM SALON GẦN NHẤT
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cột bên trái */}
          <div className="flex-1 bg-gray-50 p-4 rounded-md shadow-md">
            {/* Dropdown chọn Tỉnh/Thành phố và Quận/Huyện */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <select
                className="p-2 border rounded w-full sm:w-1/2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Tỉnh/Thành phố</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
              </select>
              <select
                className="p-2 border rounded w-full sm:w-1/2"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Quận/Huyện</option>
                <option value="Quận 1">Quận 1</option>
                <option value="Quận 2">Quận 2</option>
              </select>
            </div>

            {/* Danh sách chi nhánh với scroll */}
            {loading ? (
              <p className="text-center text-gray-500">
                Đang tải danh sách chi nhánh...
              </p>
            ) : filteredBranches.length > 0 ? (
              <div
                className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{ paddingRight: "0.5rem" }}
              >
                {filteredBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center p-4 border rounded bg-blue-50 shadow"
                  >
                    <div className="w-16 h-16 bg-blue-300 rounded flex-shrink-0"></div>
                    <div className="ml-4 flex-1">
                      <p className="text-gray-800 font-semibold">
                        {branch.address}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        {/* <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
                          Chỉ đường
                        </button> */}
                        <button className="px-4 py-2 bg-blue-500 text-white rounded">
                          Đặt lịch cắt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Không tìm thấy chi nhánh nào.
              </p>
            )}
          </div>

          {/* Cột bên phải (Bản đồ) */}
          <div className="flex-1 bg-gray-50 p-4 rounded-md shadow-md mt-6 sm:mt-0">
            <div className="relative h-screen  border rounded bg-gray-200 flex justify-center items-center">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindNearestShop;
