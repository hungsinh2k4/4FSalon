// src/manager/routes/ManagerRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManagerLayout from '../components/common/ManagerLayout';
import DashboardHome from '../pages/Dashboard/DashboardHome';
import AccountList from '../pages/Accounts/AccountList';
import AppointmentList from '../pages/Appointments/AppointmentList';
import FeedbackList from '../pages/Feedbacks/FeedbackList';
import ServiceList from '../pages/Services/ServiceList';
import ScheduleList from '../pages/Schedules/ScheduleList';
import EmployeeList from '../pages/Employees/EmployeeList';
import BranchList from '../pages/Branches/BranchList';
import NotFound from '../pages/NotFound';
import StatisticReport from '../pages/Statistic/StatisticReport';
import ReportPage from '../pages/Statistic/Report';

const ManagerRoutes: React.FC = () => {
  return (
    <ManagerLayout>
      <Routes>
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="accounts" element={<AccountList />} />
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="feedbacks" element={<FeedbackList />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="schedules" element={<ScheduleList />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="branches" element={<BranchList />} />
        <Route path="statistics" element={<StatisticReport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ManagerLayout>
  );
};

export default ManagerRoutes;
