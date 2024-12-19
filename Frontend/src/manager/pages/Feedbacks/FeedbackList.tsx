import React, { useEffect, useState } from 'react';
import FeedbacksTable from '../../components/tables/FeedbacksTable';
import styles from '../../components/common/global.module.css';
import Modal from '../../components/common/Modal';
import ModalWaiting from '../../components/common/ModalWaiting';

import FeedbackForm from '../../components/forms/FeedbackForm';
import { fetchFeedbacks, removeFeedback, addFeedback, editFeedback } from '../../services/feedbackService';
import { Feedback } from '../../utils/types';
import { FaBagShopping, FaFilter } from 'react-icons/fa6';

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalWaitingOpen, setIsModalWaitingOpen] = useState<boolean>(false);

  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null); 
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(10);

  const [filterTerm, setFilterTerm] = useState('');
  
  const [historyItems, setHistoryItems] = useState<Array<{
    id: number,
    message: string,
    type: string,
  }>>([]);
  


  
  const filteredFeedbacks = feedbacks;
  //.filter(feedback =>
  //  feedback.overall_rating.toLowerCase().includes(searchTerm.toLowerCase())
  //);
  useEffect(() => {
    const loadFeedbacks = async () => {
      setLoading(true);
      try {
        const data = await fetchFeedbacks();
        const reformattedData = data.map((feedback: any) => ({
          ...feedback,
          customer_name: feedback.appointment?.customer?.name || '---',
          branch_name: feedback.appointment?.branch?.name||'---',
          employee_name: feedback.appointment?.employee?.name || '---',
        }));
        setFeedbacks(reformattedData);
        
      } catch (err) {
        setError('Failed to fetch feedbacks.');
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  
  
  const handleSetPage = (page: number) => {
    setPage(page);
  }
  const handleSetRowPerPage = (number: number) => {
    setRowPerPage(number);
    setPage(1)
  }
  const handleNextPage = () => {
    setPage(page + 1);
  }
  const handlePrevPage = () => {
    setPage(page - 1);
  }
  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredFeedbacks.length / rowPerPage);
    let startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
    if (page <= 3) startPage = 1;
  
    return [...Array(Math.min(5, totalPages - startPage + 1))].map((_, index) => {
      const pageNumber = startPage + index;
      return (
        <button 
          key={pageNumber}
          onClick={() => handleSetPage(pageNumber)}
          className={page === pageNumber ? styles.activePage : ''}
        >
          {pageNumber}
        </button>
      );
    });
  };
  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.iconWrapper}>
            <FaBagShopping /> <p>Quản lý phản hồi</p>
          </div>
        </div>
        
      </div>
    );
  };
  const renderPageSelect = () => {
    return (
      <><div className={styles.selectPage}>
        <select value={rowPerPage} onChange={(e) => handleSetRowPerPage(Number(e.target.value))} className={styles.rowPerPage}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>
          Showing {(page - 1) * rowPerPage + 1} - {Math.min(page * rowPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length} entries
        </span>
      </div>
      <div className={styles.allPage}>
        <button onClick={() => handlePrevPage()} disabled={page === 1}> Previous </button>
        {renderPaginationButtons()}
        <button onClick={() => handleNextPage()} disabled={page >= Math.ceil(filteredFeedbacks.length / rowPerPage)}> Next </button>
        
        
      </div>
      </>
    )
  }
  const renderTable = () => {
    return (
      <FeedbacksTable 
        feedbacks={filteredFeedbacks.slice(page*rowPerPage-rowPerPage, page*rowPerPage)} 
      />
    );
  }

  const renderWaitingModal = () => {
    return(
      <ModalWaiting isOpen={isModalWaitingOpen}/>
    )
  }
  const renderHistory = () => {
    return (
      <div className={styles.historyContainer}>
        {historyItems.map((item) => {
          if (item.type === 'error') {
            return (
              <div key={item.id} className={styles.historyItemError}>
                <span>{item.message}</span>
                <div 
                  className={styles.progressBarError} 
                />
              </div>
            );
          }
          return (
            <div key={item.id} className={styles.historyItem}>
              <span>{item.message}</span>
              <div 
                className={styles.progressBar} 
              />
            </div>
          );
        })}
      </div>
    );
  };
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          
            <div className={styles.headerTitle}>
              <div className={styles.iconWrapper}>
                <FaBagShopping /> <p>Quản lý Phản hồi</p>
              </div>
            </div>
        </div>
        <ModalWaiting isOpen={loading}/>  
      </div>
    );
  }
  return (
    <div className={styles.page}>
      {renderHeader()}
      {renderPageSelect()}
      {renderWaitingModal()}
      {renderTable()}
      {renderHistory()}
    </div>
  );
};

export default FeedbackList;
