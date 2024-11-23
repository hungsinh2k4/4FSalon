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
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
                          Chỉ đường
                        </button>
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
            <div className="relative h-80 border rounded bg-gray-200 flex justify-center items-center">
              <p className="text-gray-500">
                Bản đồ tĩnh (thay bằng hình ảnh hoặc thư viện bản đồ)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindNearestShop;
