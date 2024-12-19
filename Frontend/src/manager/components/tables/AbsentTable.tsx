import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import styles from "../common/global.module.css";
import { Absence } from "../../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaXmark } from "react-icons/fa6";


interface AbsentTableProps {
	absences: Absence[];
	onDelete: (id: number) => void;
}

const AbsentTable: React.FC<AbsentTableProps> = ({absences, onDelete}) => {
	const [sortConfig, setSortConfig] = useState<{ key: keyof Absence, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'desc' });

  const sorted = [...absences].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Absence) => {
    setSortConfig((prevState) => {
      const direction = prevState.key === key && prevState.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return faSort;
    return sortConfig.direction === 'asc' ? faSortUp : faSortDown;
  };
  
	return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: '5%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead> 
          <tr>
            <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
            <th onClick={() => handleSort('employee_id')}>Mã nhân viên <FontAwesomeIcon icon={getSortIcon('employee_id')} /></th>
            <th onClick={() => handleSort('employee')}>Tên <FontAwesomeIcon icon={getSortIcon('employee')} /></th>
            <th onClick={() => handleSort('date')}>Ngày <FontAwesomeIcon icon={getSortIcon('date')} /></th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((absence) => (
            <tr key={absence.id}>
              <td>{absence.id}</td>
              <td>{absence.employee_id}</td>
              <td>{absence.employee.name}</td>
              <td>{absence.date}</td>
              <td className={styles.actionList}>
                <FaXmark className={styles.actionDelete} onClick={() => onDelete(absence.id)}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
	);
}

export default AbsentTable;