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
      
        <Route path="/login" element={<ManagerLogin />} />

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
