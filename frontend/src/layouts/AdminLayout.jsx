import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/admin/SidebarAdmin';
import TopbarAdmin from '../components/admin/TopbarAdmin';
import useThemeStore from '../stores/themeStore';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { theme, toggleTheme } = useThemeStore();

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            <SidebarAdmin collapsed={sidebarCollapsed} theme={theme} />
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                <TopbarAdmin
                    onToggleSidebar={toggleSidebar}
                    onToggleTheme={toggleTheme}
                    theme={theme}
                />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
