import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import styles from "./AbsentForm.module.css";
import { Absence, Account, Employee } from "../../utils/types";
import {
  fetchEmployee,
  fetchEmployeeByBranch,
} from "../../services/employeeService";
import { DatePicker } from "rsuite";
import { FaPlus } from "react-icons/fa6";
import { FaX } from "react-icons/fa6";

interface AbsentFormProps {
  branchId: number;
  absences: Absence[];
  onSubmit: (data: any) => void;
}

const AbsentForm: React.FC<AbsentFormProps> = ({
  branchId,
  absences,
  onSubmit,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [reasons, setReasons] = useState<{ [key: number]: string }>({});
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [date, setDate] = useState<Date | null>(new Date());

  const [invalidDateErrorMessage, setInvalidDateErrorMessage] = useState<
    string | null
  >(null);

  const [isInvalidEmployeeErrorMessage, setIsInvalidEmployeeErrorMessage] =
    useState<string | null>(null);

  const [isMultipleDate, setIsMultipleDate] = useState<boolean>(false);

  useEffect(() => {
    const loadEmployees = async () => {
      const employeeData = await fetchEmployeeByBranch(branchId);
      setEmployees(employeeData);
    };
    loadEmployees();
  }, [branchId]);

  const getDatesBetween = (fromDate: Date, toDate: Date): Date[] => {
    const dates = [];
    let currentDate = new Date(fromDate);

    currentDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    while (currentDate <= toDate) {
      dates.push(new Date(currentDate)); // Add a copy of the current date
      currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }

    return dates;
  };

  const dateCheck = (fromDate: Date | null, toDate: Date | null) => {
    if (fromDate == null || toDate == null) {
      return true;
    } else if (fromDate > toDate) {
      setInvalidDateErrorMessage(
        "From date must be earlier than or equal to To date."
      );
      return false;
    }
    setInvalidDateErrorMessage(null);
    return true;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddEmployee = (employee: Employee) => {
    const isDuplicate = absences.some((absence) => {
      // Normalize both dates to the same format
      const absenceDate = absence.date.split("T")[0];
      const selectedDate = date?.toISOString().split("T")[0];

      return (
        absence.employee_id === employee.id && absenceDate === selectedDate
      );
    });

    if (isDuplicate) {
      const formattedDate = date?.toLocaleDateString() || "the selected date";
      setIsInvalidEmployeeErrorMessage(
        `Employee "${employee.name}" is already marked as absent on ${formattedDate}.`
      );
      return;
    }

    // Add employee if not already in the selected list
    if (!selectedEmployees.some((e) => e.id === employee.id)) {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleRemoveEmployee = (employeeId: number) => {
    setSelectedEmployees(selectedEmployees.filter((e) => e.id !== employeeId));
  };

  const handleReasonChange = (employeeId: number, reason: string) => {
    setReasons({ ...reasons, [employeeId]: reason });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const absences = selectedEmployees.map((employee) => ({
      employee_id: employee.id,
      employee,
      reason: reasons[employee.id] || "",
      date: date?.toISOString() || "",
    }));
    onSubmit(absences);
  };

  const handleMultipleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dates = getDatesBetween(fromDate!, toDate!);
    const absences = selectedEmployees.flatMap((employee) =>
      dates.map((date) => ({
        employee_id: employee.id,
        employee,
        reason: reasons[employee.id] || "",
        date: date.toISOString(),
      }))
    );
    onSubmit(absences);
  };

  // Filter out selected employees from the list
  const filteredEmployees = employees
    .filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((employee) => !selectedEmployees.some((e) => e.id === employee.id));

  return (
    <form
      onSubmit={!isMultipleDate ? handleSubmit : handleMultipleDateSubmit}
      className={styles.AbsentForm}
      onError={() => {}}
    >
      <div className={styles.container}>
        {/* Left: Selected Employees and Calendar */}
        <div className={styles.leftSection}>
          <h3 style={{ fontWeight: "bold" }}>Chọn ngày nghỉ</h3>
          <div className={styles.switchWrapper}>
            <label> Nghỉ dài ngày </label>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isMultipleDate}
                onChange={() => setIsMultipleDate(!isMultipleDate)}
              />
              <span className={`${styles.slider} ${styles.sliderRound}`}></span>
            </label>
          </div>
          {isMultipleDate ? (
            <>
              <h4 style={{ fontWeight: "bold" }}>From:</h4>
              <DatePicker
                value={fromDate}
                onChange={(value) => {
                  if (dateCheck(value, toDate)) {
                    setFromDate(value);
                  }
                }}
                style={{ width: "100%" }}
                placeholder="Select a date"
                placement="auto"
              />

              <h4 style={{ fontWeight: "bold" }}>To:</h4>
              <DatePicker
                value={toDate}
                onChange={(value) => {
                  if (dateCheck(fromDate, value)) {
                    setToDate(value);
                  }
                }}
                style={{ width: "100%" }}
                placeholder="Select a date"
                placement="auto"
              />
              {invalidDateErrorMessage && (
                <p style={{ color: "red" }}>{invalidDateErrorMessage}</p>
              )}
            </>
          ) : (
            <>
              <h4 style={{ fontWeight: "bold" }}>Select Date:</h4>
              <DatePicker
                value={date}
                onChange={(value) => setDate(value)}
                style={{ width: "100%" }}
                placeholder="Select a date"
                placement="auto"
              />
            </>
          )}

          <h3 style={{ fontWeight: "bold" }}>Selected Employees</h3>
          <ul className={styles.selectedEmployeesList}>
            {selectedEmployees.map((employee) => (
              <li key={employee.id} className={styles.selectedEmployeesItem}>
                <span className={styles.column}>{employee.name}</span>

                <Input
                  label=""
                  type="text"
                  placeholder="Enter absence reason..."
                  className={styles.reasonInput}
                  value={reasons[employee.id] || ""}
                  onChange={(e) =>
                    handleReasonChange(employee.id, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveEmployee(employee.id)}
                  className={styles.removeButton}
                >
                  Remove <FaX className={styles.removeIcon} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Employee List with Search */}
        <div className={styles.rightSection}>
          <div className={styles.stickySearchBar}>
            <Input
              label="Search employees"
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchBar}
            />
          </div>
          {isInvalidEmployeeErrorMessage && (
            <p style={{ color: "red" }}>{isInvalidEmployeeErrorMessage}</p>
          )}
          <ul className={styles.employeeList}>
            {filteredEmployees.map((employee) => (
              <li key={employee.id} className={styles.employeeItem}>
                <span>{employee.name}</span>
                <span>{employee.work_position}</span>
                <span>{employee.email}</span>
                <button
                  type="button"
                  onClick={() => handleAddEmployee(employee)}
                  className={styles.addButton}
                >
                  Add <FaPlus className={styles.addIcon} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default AbsentForm;
