// src/manager/pages/Schedules/ScheduleList.tsx
import React, { useCallback, useEffect, useState } from "react";
import SchedulesTable from "../../components/tables/SchedulesTable";
import Modal from "../../components/common/Modal";

import ScheduleForm from "../../components/forms/ScheduleForm";
import styles from "./ScheduleList.module.css";
import {
  fetchSchedules,
  fetchSchedulesByBranch,
  removeSchedule,
  addSchedule,
  editSchedule,
  removeAbsence,
  addAbsence,
  fetchAbsencesByBranch,
} from "../../services/scheduleService";
import { Absence, Schedule } from "../../utils/types";
import { fetchBranches } from "../../services/branchService";
import CalendarTable from "../../components/tables/CalendarTable";
import "rsuite/Calendar/styles/index.css";
import AbsentTable from "../../components/tables/AbsentTable";
import { FaCalendar } from "react-icons/fa6";
import AbsentForm from "../../components/forms/AbsentForm";
import AbsenceModal from "../../components/common/AbsenceModal";
import { Circles } from "react-loader-spinner";

// Removed local Schedule interface as it is imported from scheduleService
interface Branch {
  id: number;
  name: string;
}

const ScheduleList: React.FC = () => {
  const currentDate = new Date();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null); // State để lọc theo chi nhánh
  const [absences, setAbsences] = useState<Absence[]>([]); // State để kiểm soát lịch nghỉ
  const [year, setYear] = useState<number>(currentDate.getFullYear()); // State để kiểm soát năm
  const [month, setMonth] = useState<number>(currentDate.getMonth()); // State để kiểm soát tháng
  const [isTableView, setIsTableView] = useState<boolean>(true);

  // State để kiểm soát modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null); // null cho Add, schedule cụ thể cho Edit
  const [currentAbsence, setCurrentAbsence] = useState<Absence | null>(null); // null cho Add, absence cụ thể cho Edit

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranches();
        setBranches(data);
      } catch (err) {
        setError("Failed to fetch branches.");
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      try {
        const data = !selectedBranch
          ? await fetchSchedules()
          : await fetchSchedulesByBranch(selectedBranch);
        const reformattedData = data.map((sche: any) => ({
          ...sche,
          employee_name: sche.employee?.name || '---',
        }));
        
        setSchedules(reformattedData);
      } catch (err) {
        setError("Failed to fetch schedule.");
      } finally {
        setLoading(false);
      }
    };
    const loadAbsences = async () => {
      try {
        if (selectedBranch !== null) {
          const data = await fetchAbsencesByBranch(selectedBranch);
          setAbsences(data);
        }
      } catch (err) {
        setError("Failed to fetch absences.");
      }
    };
    loadAbsences();
    loadSchedules();
  }, [selectedBranch]);

  const handleSelectBranch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(Number(e.target.value) || null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch làm việc này?")) {
      try {
        await removeSchedule(id);
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
      } catch (err) {
        setError("Failed to delete schedule.");
      }
    }
  };

  const handleAdd = () => {
    setCurrentSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setCurrentSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (currentSchedule) {
        // Edit schedule
        const editdSchedule = await editSchedule(data);
        console.log(editdSchedule);
        setSchedules(
          schedules.map((schedule) =>
            schedule.id === editdSchedule.id ? editdSchedule : schedule
          )
        );
      } else {
        // Add schedule
        const newSchedule = await addSchedule(data);
        setSchedules([...schedules, newSchedule]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save schedule.");
    }
  };

  const handleAbsentFormSubmit = async (data: Absence[]) => {
    try {
      data.forEach(async (absence: Absence) => {
        await addAbsence(absence);
        const loadAbsences = async () => {
          
          try {
            if (selectedBranch !== null) {
              const data = await fetchAbsencesByBranch(selectedBranch);
              setAbsences(data);
            }
          } catch (err) {
            setError("Failed to fetch absences.");
          }
        };
        loadAbsences();
        setIsAbsenceModalOpen(false);
      });
      
    } catch (err) {
      setError("Failed to save absence.");
    }
  };

  const handleAbsenceAdd = () => {
    setCurrentAbsence(null);
    setIsAbsenceModalOpen(true);
  };

  const handleAddAbsence = async (employee_id: number, day: number) => {
    const date = new Date(year, month, day);
    const response = await addAbsence({
      employee_id,
      date: date.toISOString(),
    });
    setAbsences([...absences, response]);
  };

  const handleDeleteAbsence = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch nghỉ này?")) {
      try {
        await removeAbsence(id);
        setAbsences(absences.filter((absence) => absence.id !== id));
      } catch (err) {
        setError("Failed to remove absence day.");
      }
    }
  };

  const handleOnChange = useCallback(
    (year: number, month: number) => {
      setYear(year);
      setMonth(month);
    },
    [year, month]
  );

  // const filteredSchedules = schedules.filter((schedule) =>
  //   schedule.branches.includes(searchTerm) // Ví dụ tìm kiếm theo ngày
  // );

  if (loading) {
    return <div className={styles.loaderWrapper}>{<Circles height="50" width="50" color="#3498db" />} </div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.iconWrapper}>
            <FaCalendar /> <p>Quản lý lịch làm việc</p>
          </div>
        </div>
        <div className={styles.addButton} onClick={handleAdd}>
          + Thêm lịch của nhân viên
        </div>
      </div>
      <div>
        <select
          className={styles.branchSelect}
          onChange={handleSelectBranch}
          value={selectedBranch || "All"}
        >
          <option>All</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.divider}>
        <div>
          <label> Danh sách lịch làm việc </label>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      <SchedulesTable
        schedules={schedules
          .filter((row) => !searchTerm.length || row.employee.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <div className={styles.divider}>
        <label> Danh sách lịch nghỉ</label>
        <div
          style={{
            width: "100px",
            margin: "auto",
          }}
        ></div>
      </div>
      {selectedBranch ? (
        <div>
          <div className={styles.header}>
            <div className={styles.switchWrapper}>
              <label> Xem kiểu lịch </label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={!isTableView}
                  onChange={() => setIsTableView(!isTableView)}
                />
                <span
                  className={`${styles.slider} ${styles.sliderRound}`}
                ></span>
              </label>
            </div>
            <div className={styles.addButton} onClick={handleAbsenceAdd}>
              + Thêm ngày nghỉ
            </div>
          </div>
          {!isTableView ? (
            <CalendarTable
              year={year}
              month={month}
              absences={absences}
              schedules={schedules}
              onChange={handleOnChange}
              onCreate={handleAddAbsence}
              onDelete={handleDeleteAbsence}
            />
          ) : (
            <AbsentTable absences={absences} onDelete={handleDeleteAbsence} />
          )}
        </div>
      ) : (
        <div>
          <label> Chọn chi nhánh để tùy chỉnh lịch nghỉ </label>
        </div>
       
      )}
      {/* Modal cho Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentSchedule ? "Chỉnh sửa lịch làm việc" : "Thêm lịch làm việc"
        }
      >
        <ScheduleForm
          initialData={currentSchedule || undefined}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <AbsenceModal
        isOpen={isAbsenceModalOpen}
        onClose={() => setIsAbsenceModalOpen(false)}
        title={"Thêm lịch nghỉ"}
      >
        <AbsentForm
          branchId={selectedBranch || -1}
          absences={absences}
          onSubmit={handleAbsentFormSubmit}
        />
      </AbsenceModal>
    </div>
  );
};

export default ScheduleList;
