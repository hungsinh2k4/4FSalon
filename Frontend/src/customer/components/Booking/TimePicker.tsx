import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { beautifyTime } from "../../utils/helpers";
import { Schedule } from "../../utils/types";

interface TimePickerProps {
  onTimeSelect: (time: string | null) => void; // Callback function để truyền giá trị giờ đã chọn ra ngoài
  schedule: Schedule[]; // Danh sách lịch làm việc
  isDisplaying: Boolean;
  selectedDate?: Date;
  setErrorTime: Dispatch<SetStateAction<string | null>>;
}

export default function TimePicker({
  onTimeSelect,
  schedule,
  isDisplaying,
  selectedDate,
  setErrorTime
}: TimePickerProps) {
  
  
  
  const generateTimes = () => {
    // const times = new Map<string, boolean>();
    let hour = 7;
    let minute = 0;

    while (hour < 21 || (hour === 21 && minute === 0)) {
      times.set(`${hour}:${minute === 0 ? "00" : minute}`, true);
      minute += 20;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
    }

    return times;
  };



  const [times, setTimes] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  useEffect(() => {
    setTimes(generateTimes());
  }, []);

  
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
      if (end < times.size) {
        return [start + 24, end + 24];
      }
      return [start, end];
    });
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime((prev) => {
      setErrorTime("");
      const newSelectedTime = prev === time ? null : time;
      onTimeSelect(newSelectedTime); // Trả giá trị selectedTime ra ngoài thông qua callback
      return newSelectedTime;
    });
  };

  useEffect(() => {
    // Kiểm tra xem giờ có bị disable hay không
    const isDisabled = (): boolean => {
      // const [hour, minute] = time.split(":").map(Number);

      // const timeInMinutes = hour * 60 + minute;

      // Disable passed time
      const currentTime = beautifyTime(new Date().toISOString());
      let tempHour = 7;
      let tempMinute = 0;
      let [currentHour, currentMinute] = currentTime.split(":").map(Number);

      while (
        tempHour < currentHour ||
        (tempHour === currentHour && tempMinute <= currentMinute)
      ) {
        const timeString = `${tempHour}:${
          tempMinute === 0 ? "00" : tempMinute
        }`;
        times.set(timeString, false);
        tempMinute += 20;
            if (tempMinute === 60) {
              tempMinute = 0;
              tempHour += 1;
            }
      }

      return Array.from(schedule).flat().some(({ start_time, estimated_end_time }) => {
        // const startDate = new Date(start_time);
        // const endDate = new Date(estimated_end_time);
        let tempTime = beautifyTime(start_time);

        setTimes((times) => {
          const newTimes = new Map(times);
          const startTime = new Date(start_time);
          const endTime = new Date(estimated_end_time);
          let iteration =
            Math.floor(
              (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 20)
            ) + 1;
          while (iteration--) {
            let [hour, minute] = tempTime.split(":").map(Number);

            if (newTimes.get(tempTime) == false) {
              minute += 20;
              if (minute === 60) {
                minute = 0;
                hour += 1;
              }
              continue;
            }
            newTimes.set(tempTime, false);
            if (tempTime === estimated_end_time) break;

            if (hour == 21) break;

            minute += 20;
            if (minute === 60) {
              minute = 0;
              hour += 1;
            }

            tempTime = `${hour}:${minute === 0 ? "00" : minute}`;
          }

          return newTimes;
        });
        // const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
        // const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

        // return timeInMinutes >= startMinutes && timeInMinutes < endMinutes;
      });
    };

    isDisabled();
  }, [schedule]);

  return (
    <div
      className={`flex items-center justify-center space-x-2 ${
        isDisplaying ? "block" : "hidden"
      }`}
    >
      <button
        onClick={handlePrev}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50"
        disabled={visibleRange[0] === 0}
      >
        &lt;
      </button>

      <div className="grid grid-cols-8 gap-3 min-h-[200px] grid-auto-rows-[40px] place-items-start">
        {Array.from(times.keys())
          .slice(visibleRange[0], visibleRange[1])
          .map((key) => (
            <button
              key={key}
              onClick={() => handleTimeClick(key)}
              disabled={!times.get(key)} // Disable nếu giờ nằm trong khoảng không khả dụng
              className={`p-3 rounded-md text-center text-sm font-medium ${
                selectedTime === key
                  ? "bg-teal-600 text-white font-bold"
                  : times.get(key) === false
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {key}
            </button>
          ))}
      </div>

      <button
        onClick={handleNext}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50"
        disabled={visibleRange[1] >= times.size}
      >
        &gt;
      </button>
    </div>
  );
}
