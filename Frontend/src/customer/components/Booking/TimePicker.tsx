import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { beautifyTime } from "../../utils/helpers";
import { Schedule } from "../../utils/types";

interface TimePickerProps {
  onTimeSelect: (time: string | null) => void;
  schedule: Schedule[];
  isDisplaying: Boolean;
  selectedDate?: Date;
  setErrorTime: Dispatch<SetStateAction<string | null>>;
  timeBlock: number;
}

export default function TimePicker({
  onTimeSelect,
  schedule,
  isDisplaying,
  selectedDate,
  setErrorTime,
  timeBlock
}: TimePickerProps) {
  const [times, setTimes] = useState<Map<string, boolean>>(new Map());
  const [visibleRange, setVisibleRange] = useState([0, 24]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const generateTimes = () => {
    const timeMap = new Map<string, boolean>();
    let hour = 7;
    let minute = 0;

    while (hour < 21 || (hour === 21 && minute === 0)) {

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0)
      if (selectedDate && selectedDate < currentDate) {
        timeMap.set(`${hour}:${minute === 0 ? "00" : minute}`, false);
      } else {
        timeMap.set(`${hour}:${minute === 0 ? "00" : minute}`, true);
      }

      minute += 20;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
    }

    return timeMap;
  };

  const updateTimesBasedOnSelectedDate = () => {
    const freshTimes = generateTimes();
    const now = new Date();
    const isToday = selectedDate?.toDateString() === now.toDateString();

    if (isToday) {
      const currentTime = beautifyTime(now.toISOString());
      const [currentHour, currentMinute] = currentTime.split(":").map(Number);
      let tempHour = 7;
      let tempMinute = 0;

      while (
        tempHour < currentHour ||
        (tempHour === currentHour && tempMinute <= currentMinute)
      ) {
        if (tempHour > 21 || (tempHour === 21 && tempMinute > 0)) {
          break;
        }
        const timeString = `${tempHour}:${tempMinute === 0 ? "00" : tempMinute}`;
        freshTimes.set(timeString, false);
        tempMinute += 20;
        if (tempMinute === 60) {
          tempMinute = 0;
          tempHour += 1;
        }
      }
    }

    schedule.forEach(({ start_time, estimated_end_time }) => {
      let tempTime = beautifyTime(start_time);
      const startTime = new Date(start_time);
      const endTime = new Date(estimated_end_time);

      let iterations =
        Math.floor(
          (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 20)
        ) + 1;

      let block = timeBlock;
      while (block > 0) {

        let [hour, minute] = tempTime.split(":").map(Number);
        minute -= 20;
        if (minute < 0) {
          minute = 40;
          hour -= 1;
        }
        if (hour < 7) { break; }
        tempTime = `${hour}:${minute === 0 ? "00" : minute}`;
        freshTimes.set(tempTime, false);
        block--;
      }

      tempTime = beautifyTime(start_time);
      while (iterations--) {
        let [hour, minute] = tempTime.split(":").map(Number);
        if (hour > 21 || (hour === 21 && minute > 0)) {
          break;
        }
        freshTimes.set(tempTime, false);

        if (tempTime === beautifyTime(estimated_end_time)) break;

        minute += 20;
        if (minute === 60) {
          minute = 0;
          hour += 1;
        }
        tempTime = `${hour}:${minute === 0 ? "00" : minute}`;
      }
    });

    setTimes(freshTimes);
    setSelectedTime(null);
    onTimeSelect(null);
  };

  useEffect(() => {
    updateTimesBasedOnSelectedDate();
  }, [selectedDate, schedule, timeBlock]);

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
      onTimeSelect(newSelectedTime);
      return newSelectedTime;
    });
  };

  return (
    <div
      className={`flex items-center justify-center space-x-2 ${isDisplaying ? "block" : "hidden"
        }`}
    >
      <button
        type="button"
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
              type="button"
              key={key}
              onClick={() => handleTimeClick(key)}
              disabled={!times.get(key)}
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
        type="button"
        onClick={handleNext}
        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 disabled:opacity-50"
        disabled={visibleRange[1] >= times.size}
      >
        &gt;
      </button>
    </div>
  );
}
