// src/manager/components/tables/FeedbacksTable.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FaPen, FaXmark } from 'react-icons/fa6';

import Button from '../common/Button';
import styles from '../../components/common/global.module.css';
import { Feedback } from '../../utils/types';

interface FeedbacksTableProps {
  feedbacks: Feedback[];

}

const FeedbacksTable: React.FC<FeedbacksTableProps> = ({ feedbacks }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Feedback, direction: 'asc' | 'desc' | '' }>({ key: 'id', direction: 'asc' });

  const sorted = [...feedbacks].sort((a, b) => {
    if (sortConfig.key) {
      const key = sortConfig.key;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (a[key] != null && b[key] != null && a[key] < b[key]) return -direction;
      if (a[key] != null && b[key] != null && a[key] > b[key]) return direction;
    }
    return 0;
  });
  const handleSort = (key: keyof Feedback) => {
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
      <table>
        <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '20%' }} />
        </colgroup>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID <FontAwesomeIcon icon={getSortIcon('id')} /></th>
            <th onClick={() => handleSort('customer_name')}>Customer Name <FontAwesomeIcon icon={getSortIcon('customer_name')} /></th>
            <th onClick={() => handleSort('branch_name')}>Branch Name <FontAwesomeIcon icon={getSortIcon('branch_name')} /></th>
            <th onClick={() => handleSort('branch_rating')}>Branch Rating <FontAwesomeIcon icon={getSortIcon('branch_rating')} /></th>
            <th onClick={() => handleSort('branch_feedback')}>Branch Feedback <FontAwesomeIcon icon={getSortIcon('branch_feedback')} /></th>
            <th onClick={() => handleSort('employee_name')}>Employee Name <FontAwesomeIcon icon={getSortIcon('employee_name')} /></th>
            <th onClick={() => handleSort('employee_rating')}>Employee Rating <FontAwesomeIcon icon={getSortIcon('employee_rating')} /></th>
            <th onClick={() => handleSort('employee_feedback')}>Employee Feedback <FontAwesomeIcon icon={getSortIcon('employee_feedback')} /></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.id}</td>
              <td>{feedback.customer_name || '---'}</td>
              <td>{feedback.branch_name || '---'}</td>
              <td>{feedback.branch_rating}</td>
              <td>{feedback.branch_feedback || '---'}</td>
              <td>{feedback.employee_name || '---'}</td>
              <td>{feedback.employee_rating}</td>
              <td>{feedback.employee_feedback || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbacksTable;
