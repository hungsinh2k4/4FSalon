import React from "react";
import { Employee } from "../../utils/types";

interface EmployeeListProps {
  viewType: string;
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
  searchTerm: String;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  viewType,
  employees,
  selectedEmployee,
  setSelectedEmployee,
  searchTerm
}) => {
  if (viewType !== "employees") return null;
  return (
    <div className="mt-2.5 max-h-[500px] overflow-y-auto border border-gray-300 rounded-s-lg p-2 grid grid-cols-2 gap-3.5">
      {employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.work_position.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((employee) => (
        <button
          key={employee.id}
          onClick={() =>
            setSelectedEmployee(
              selectedEmployee?.id === employee.id ? null : employee
            )
          }
          className={`w-full py-6.5 h-[400px] my-2.5 transition-transform duration-300 transform hover:scale-105 ${
            selectedEmployee?.id === employee.id
              ? "bg-blue-200 border-blue-950" // Style khi được chọn
              : "bg-gray-100 border-[#0a0a0a] hover:bg-gray-200 hover:border-gray-400"
          } cursor-pointer text-left flex rounded-lg shadow-md`}
        >
          <div className="w-2/5 h-full overflow-hidden rounded-s-lg">
            <img
              src={employee.big_avatar_url}
              alt={employee.name}
              className="w-full h-full object-cover overflow-hidden rounded-s-lg"
            />
          </div>
          <div className="flex-1 p-4">
            <strong>{employee.name}</strong>
            <div className="text-sm text-gray-600 font-semibold">Số điện thoại: {employee.phone}</div>
            <div className="text-sm text-gray-600 text-transform: capitalize font-semibold">
              Vị trí : {employee.work_position}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default EmployeeList;
