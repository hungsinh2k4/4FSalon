// src/manager/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManagerLogin from './pages/Login/ManagerLogin';
import ManagerRoutes from './routes/ManagerRoutes';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';

const ManagerApp: React.FC = () => {
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={<ManagerLogin />} />

      {/* Protected Routes: All routes under /manager/* */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ManagerRoutes />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Route: NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ManagerApp;
