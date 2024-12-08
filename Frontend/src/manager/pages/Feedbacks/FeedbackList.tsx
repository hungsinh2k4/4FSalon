// src/manager/pages/Feedbacks/FeedbackList.tsx
import React, { useEffect, useState } from "react";
import FeedbacksTable from "../../components/tables/FeedbacksTable";
import styles from "./FeedbackList.module.css";
import { fetchFeedbacks, removeFeedback } from "../../services/feedbackService";
import Input from "../../components/common/Input";

interface Feedback {
  id: number;
  message: string;
  date: string;
  // Thêm các trường khác nếu cần
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await fetchFeedbacks();
        setFeedbacks(data);
      } catch (err) {
        setError("Failed to fetch feedbacks.");
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) {
      try {
        await removeFeedback(id);
        setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
      } catch (err) {
        setError("Failed to delete feedback.");
      }
    }
  };

  // const filteredFeedbacks = feedbacks.filter((feedback) =>
  //   feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className={styles.feedbackList}>
      <h2>Danh sách phản hồi</h2>
      <div className={styles.actions}>
        <Input
          label=""
          type="text"
          placeholder="Tìm kiếm phản hồi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {/* <FeedbacksTable feedbacks={filteredFeedbacks} onDelete={handleDelete} /> */}
    </div>
  );
};

export default FeedbackList;
