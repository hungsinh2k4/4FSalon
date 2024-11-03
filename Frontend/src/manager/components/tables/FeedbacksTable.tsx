// src/manager/components/tables/FeedbacksTable.tsx
import React from 'react';
import Button from '../common/Button';
import styles from './FeedbacksTable.module.css';

interface Feedback {
  id: number;
  message: string;
  date: string;
  // Thêm các trường khác nếu cần
}

interface FeedbacksTableProps {
  feedbacks: Feedback[];
  onDelete: (id: number) => void;
}

const FeedbacksTable: React.FC<FeedbacksTableProps> = ({ feedbacks, onDelete }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nội dung</th>
          <th>Ngày</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.map((feedback) => (
          <tr key={feedback.id}>
            <td>{feedback.id}</td>
            <td>{feedback.message}</td>
            <td>{feedback.date}</td>
            <td>
              <Button onClick={() => onDelete(feedback.id)}>Xóa</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbacksTable;
