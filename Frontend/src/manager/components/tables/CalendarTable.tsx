import React, { useState, useEffect } from 'react';
import styles from './CalendarTable.module.css';
import { Employee, Schedule } from '../../utils/types';
import Button from '../common/Button';
import { FaAnglesLeft, FaAnglesRight, FaX } from 'react-icons/fa6';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import { on } from 'rsuite/esm/DOMHelper';
import { set } from 'rsuite/esm/internals/utils/date';

type CalendarEvent = {
  id: number;
  employee_id: number;
  date: string;
  employee: Employee;
};

interface CalendarTableProps {
  year: number;
  month: number;
  absences: CalendarEvent[];
  schedules: Schedule[];
  onCreate: (employee_id: number, day: number) => void;
  onDelete: (id: number) => void;
  onChange?: (year: number, month: number) => void;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

const CalendarTable: React.FC<CalendarTableProps> = ({ year, month, schedules, absences, onCreate, onDelete, onChange }) => {
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDate = new Date();

  useEffect(() => {
    const getDaysInMonth = (year: number, month: number): Date[] => {
      const date = new Date(year, month, 1);
      const days: Date[] = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return days;
    };
    setDaysInMonth(getDaysInMonth(year, month));
  }, [year, month]);

  useEffect(() => {
    setEvents(absences);
  }, [absences]);

  const isBeforeToday = (day: number) => {
    const date = new Date(year, month, day);
    return date.getDate() < currentDate.getDate();
  };

  const isToday = (day: number) => {
    const date = new Date(year, month, day);
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleCreateEvent = (day: number) => {
    //onCreate(, day);
  }

  const returnToToday = () => {
    onChange && onChange(currentDate.getFullYear(), currentDate.getMonth());
  }

  const compareDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  }

  const prevMonth = () => { 
    onChange && onChange(
      month === 0 ? year - 1 : year,
      month === 0 ? 11 : month - 1
    );
  }

  const nextMonth = () => {
    onChange && onChange(
      month === 11 ? year + 1 : year,
      month === 11 ? 0 : month + 1
    );
  }

  const renderCalendar = () => {
    const firstDayOfMonth = daysInMonth[0]?.getDay() || 0;
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth.length) / 7) * 7;
    const calendarCells = Array.from({ length: totalCells }, (_, i) => {
      const day = i - firstDayOfMonth + 1;
      return day > 0 && day <= daysInMonth.length ? day : null;
    });

    return calendarCells.map((day, index) => (
      <div key={index} className={styles.calendarCell} onClick={() => day !== null && handleCreateEvent(day)}>
        {day && <div className={`${(day && isToday(day)) ? styles.dateNumberToday : styles.dateNumber}`}>{day}</div>}
        {day && (
          <div className={styles.eventContainer}>
            {/* Render events for the specific day */}
            {events
              .filter((event) => compareDate(new Date(event.date), new Date(year, month, day)))
              .map((event) => (
                <div key={event.id} className={styles.event} onClick={() => onDelete(event.id)}>
                  {event.employee.name}
                </div>
              ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.headerButtonWrapper}>
          <button className={styles.todayButton} onClick={returnToToday}>Today</button>
          <div className={styles.directionButtonWrapper}>
            <button className={styles.directionButton} onClick={prevMonth}><FaAnglesLeft/></button>
            <button className={styles.directionButton} onClick={nextMonth}><FaAnglesRight/></button>
          </div>
        </div>
        <div className={styles.calendarTitle}>
          {monthsOfYear[month]} {year}
        </div>
        <div className={styles.headerDatePicker}>
          <DatePicker 
            defaultValue={currentDate} 
            format="yyyy-MM" 
            editable={false} 
            cleanable={false}
            onChange={(date) => {date && onChange && onChange(date.getFullYear(), date.getMonth())}}
          />
        </div>
      </div>
      {/* <div className={styles.calendarWrapper}> */}
        <div className={styles.calendarColumnHeader}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayOfWeek}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {renderCalendar()}
        </div>
      {/* </div> */}
    </div>
  );
};

export default CalendarTable;
