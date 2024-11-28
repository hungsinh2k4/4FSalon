import { useState } from "react";
type Schedule = { start_time: string; estimated_end_time: string }[];
interface TimePickerProps {
  onTimeSelect: (time: string | null) => void; // Callback function để truyền giá trị giờ đã chọn ra ngoài
  schedule: Schedule; // Danh sách lịch làm việc
}

export default function TimePicker({
  onTimeSelect,
  schedule,
}: TimePickerProps) {
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
  const [visibleRange, setVisibleRange] = useState([0, 24]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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

  const handleTimeClick = (time: string) => {
    setSelectedTime((prev) => {
      const newSelectedTime = prev === time ? null : time;
      onTimeSelect(newSelectedTime); // Trả giá trị selectedTime ra ngoài thông qua callback
      return newSelectedTime;
    });
  };

  // Kiểm tra xem giờ có bị disable hay không
  const isDisabled = (time: string): boolean => {
    const [hour, minute] = time.split(":").map(Number);

    const timeInMinutes = hour * 60 + minute;

    return schedule.some(({ start_time, estimated_end_time }) => {
      const startDate = new Date(start_time);
      const endDate = new Date(estimated_end_time);

      const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

      return timeInMinutes >= startMinutes && timeInMinutes < endMinutes;
    });
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handlePrev}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50"
        disabled={visibleRange[0] === 0}
      >
        &lt;
      </button>

      <div className="grid grid-cols-8 gap-3 min-h-[200px] grid-auto-rows-[40px] place-items-start">
        {times.slice(visibleRange[0], visibleRange[1]).map((time, index) => (
          <button
            key={index}
            onClick={() => handleTimeClick(time)}
            disabled={isDisabled(time)} // Disable nếu giờ nằm trong khoảng không khả dụng
            className={`p-3 rounded-md text-center text-sm font-medium ${selectedTime === time
                ? "bg-blue-500 text-white font-bold"
                : isDisabled(time)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
          >
            {time}
          </button>
        ))}
      </div>

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
