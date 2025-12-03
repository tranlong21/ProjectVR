// ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ role }) => {
  const { user, token } = useAuthStore();

  // Lúc app mới load, chưa kịp init từ localStorage
  if (token === null && user === null) {
    return <div>Loading...</div>;
  }

  // Không có token → đá về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu route yêu cầu role cụ thể (vd: ROLE_ADMIN)
  if (role && !user?.roles?.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
