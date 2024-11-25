import { useState } from "react";

interface TimePickerProps {
  onTimeSelect: (time: string | null) => void; // Callback function để truyền giá trị giờ đã chọn ra ngoài
}

export default function TimePicker({ onTimeSelect }: TimePickerProps) {
  // Tạo danh sách giờ
  const generateTimes = () => {
    const times = [];
    let hour = 7;
    let minute = 0;

    while (hour < 20 || (hour === 20 && minute === 0)) {
      times.push(`${hour}:${minute === 0 ? "00" : minute}`);
      minute += 20;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
    }

    return times;
  };

  const times = generateTimes();
  const [visibleRange, setVisibleRange] = useState([0, 24]); // Hiển thị 24 khung giờ
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // Lưu trữ giờ đã chọn

  // Điều hướng
  const handlePrev = () => {
    setVisibleRange(([start, end]) => {
      if (start > 0) {
        return [start - 24, end - 24];
      }
      return [start, end];
    });
  };

  const handleNext = () => {
    setVisibleRange(([start, end]) => {
      if (end < times.length) {
        return [start + 24, end + 24];
      }
      return [start, end];
    });
  };

  // Xử lý khi người dùng chọn hoặc bỏ chọn giờ
  const handleTimeClick = (time: string) => {
    setSelectedTime((prev) => {
      const newSelectedTime = prev === time ? null : time;
      onTimeSelect(newSelectedTime); // Trả giá trị selectedTime ra ngoài thông qua callback
      return newSelectedTime;
    });
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Nút điều hướng trái */}
      <button
        onClick={handlePrev}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50"
        disabled={visibleRange[0] === 0}
      >
        &lt;
      </button>

      {/* Lưới hiển thị giờ */}
      <div className="grid grid-cols-8 gap-3 min-h-[200px] grid-auto-rows-[40px] place-items-start">
        {times.slice(visibleRange[0], visibleRange[1]).map((time, index) => (
          <button
            key={index}
            onClick={() => handleTimeClick(time)} // Thêm sự kiện click
            className={`p-3 rounded-md text-center text-sm font-medium hover:bg-gray-400 ${
              selectedTime === time
                ? "bg-blue-500 text-white font-bold"
                : "bg-gray-300"
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Nút điều hướng phải */}
      <button
        onClick={handleNext}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50"
        disabled={visibleRange[1] >= times.length}
      >
        &gt;
      </button>
    </div>
  );
}
