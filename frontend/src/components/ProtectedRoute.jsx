import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const ProtectedRoute = ({ role }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && !user.roles?.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
