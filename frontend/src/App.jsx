import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/authStore';
import { isAdmin } from './utils/authUtils';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import UserDashboard from './pages/UserDashboard';
import Services from './pages/Services';
import Solutions from './pages/Solutions';
import Portfolio from './pages/Portfolio';
import Technology from './pages/Technology';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Vr360 from './pages/solutions/Vr360';
import Education from './pages/solutions/Education';
import HistoricalSites from './pages/solutions/HistoricalSites';
import RealEstate from './pages/solutions/RealEstate';
import Tourism from './pages/solutions/Tourism';
import SolutionCategory from './pages/solutions/SolutionCategory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminScenes from './pages/admin/AdminScenes';
import AdminModels from './pages/admin/AdminModels';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGallery from './pages/admin/AdminGallery';

const App = () => {

    const { user } = useAuthStore();

    return (
        <Routes>

            {/* AUTH */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* USER ROUTES */}
            <Route element={<UserLayout />}>

                <Route
                    path="/"
                    element={
                        user && isAdmin(user)
                            ? <Navigate to="/admin/dashboard" replace />
                            : <Home />
                    }
                />

                <Route path="/projects" element={<ProjectList />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/solution/vr-360" element={<Vr360 />} />
                <Route path="/solution/education" element={<Education />} />
                <Route path="/solution/historical-sites" element={<HistoricalSites />} />
                <Route path="/solution/real-estate" element={<RealEstate />} />
                <Route path="/solution/tourism" element={<Tourism />} />
                <Route path="/solution/:category" element={<SolutionCategory />} />
                {/* Kept old route for backward compatibility if needed, or redirect */}
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/dashboard" element={<UserDashboard />} />
            </Route>

            {/* ADMIN ROUTES */}
            <Route element={<ProtectedRoute role="ROLE_ADMIN" />}>

                <Route
                    path="/admin"
                    element={<Navigate to="/admin/dashboard" replace />}
                />

                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/projects" element={<AdminProjects />} />
                    <Route path="/admin/blog" element={<AdminBlog />} />
                    <Route path="/admin/scenes" element={<AdminScenes />} />
                    <Route path="/admin/models" element={<AdminModels />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/gallery" element={<AdminGallery />} />
                </Route>
            </Route>

        </Routes>
    );
};

export default App;
