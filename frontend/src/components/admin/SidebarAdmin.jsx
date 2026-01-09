import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Box, Folder, Image, Users, LogOut, Layers } from 'lucide-react';

const SidebarAdmin = ({ collapsed, theme }) => {
    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
        { path: '/admin/categories', icon: <Layers size={20} />, label: 'Categories' },
        { path: '/admin/projects', icon: <Folder size={20} />, label: 'Projects' },
        { path: '/admin/blog', icon: <FileText size={20} />, label: 'Blog' },
        { path: '/admin/models', icon: <Box size={20} />, label: 'Models' },
        { path: '/admin/scenes', icon: <Image size={20} />, label: 'Scenes' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/gallery', icon: <Image size={20} />, label: 'Gallery' },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}>
            <div className="h-16 flex items-center justify-center border-b border-[var(--border-color)]">
                {collapsed ? (
                    <span className="text-xl font-bold text-[#9b4dff]">VR</span>
                ) : (
                    <span className="text-xl font-bold text-[#9b4dff]">VRPLUS ADMIN</span>
                )}
            </div>

            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg transition-colors ${isActive
                                ? 'bg-[#9b4dff]/10 text-[#9b4dff]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                            }`
                        }
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!collapsed && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default SidebarAdmin;
