import React from 'react';
import { Menu, Sun, Moon, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const TopbarAdmin = ({ onToggleSidebar, onToggleTheme, theme }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-[var(--card-bg)] border-b border-[var(--border-color)] flex items-center justify-between px-6 transition-colors duration-300 sticky top-0 z-30">
            <div className="flex items-center">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[#9b4dff] transition-colors"
                >
                    <Menu size={20} />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[#9b4dff] transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[#9b4dff] transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--card-bg)]"></span>
                </button>

                <div className="flex items-center pl-4 border-l border-[var(--border-color)] space-x-3">
                    <div className="mr-3 text-right hidden sm:block">
                        <p className="text-sm font-bold text-[var(--text-primary)]">{user?.username || 'Admin'}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Administrator</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#9b4dff] flex items-center justify-center text-white font-bold">
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopbarAdmin;
