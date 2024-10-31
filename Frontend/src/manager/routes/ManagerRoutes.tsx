// src/manager/routes/ManagerRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../pages/Dashboard/Dashboard';
import DashboardHome from '../pages/Dashboard/DashboardHome';
import AccountList from '../pages/Accounts/AccountList';
import AppointmentList from '../pages/Appointments/AppointmentList';
import FeedbackList from '../pages/Feedbacks/FeedbackList';
import ServiceList from '../pages/Services/ServiceList';
import ScheduleList from '../pages/Schedules/ScheduleList';
import EmployeeList from '../pages/Employees/EmployeeList';
import BranchList from '../pages/Branches/BranchList';
import NotFound from '../pages/NotFound';

const ManagerRoutes: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        {/* Trang Chính của Dashboard */}
        <Route path="dashboard" element={<DashboardHome />} />

        {/* Accounts Routes */}
        <Route path="accounts" element={<AccountList />} />

        {/* Appointments Routes */}
        <Route path="appointments" element={<AppointmentList />} />

        {/* Feedbacks Routes */}
        <Route path="feedbacks" element={<FeedbackList />} />

        {/* Services Routes */}
        <Route path="services" element={<ServiceList />} />

        {/* Schedules Routes */}
        <Route path="schedules" element={<ScheduleList />} />

        {/* Employees Routes */}
        <Route path="employees" element={<EmployeeList />} />

        {/* Branches Routes */}
        <Route path="branches" element={<BranchList />} />

        {/* Route Không Tồn Tại */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ManagerRoutes;
