import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Sun, Moon, Globe, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import useThemeStore from '../stores/themeStore';
import useAuthStore from '../stores/authStore';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useThemeStore();
    const { user, isAuthenticated, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { path: '/', label: t('nav.home') || 'Home' },
        { path: '/projects', label: t('nav.projects') || 'Projects' },
        { path: '/services', label: t('nav.services') || 'Services' },
        { path: '/solutions', label: t('nav.solutions') || 'Solutions' },
        { path: '/technology', label: t('nav.technology') || 'Technology' },
        { path: '/blog', label: t('nav.blog') || 'Blog' },
        // { path: '/contact', label: t('nav.contact') || 'Contact' },
    ];

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'vi', label: 'Tiếng Việt' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsLangMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass-panel border-b border-[var(--border-color)] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-purple-hover)] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">VR</span>
                        </div>
                        <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:block">
                            VR<span className="text-[var(--accent-purple)]">Plus</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-[var(--accent-purple)] text-white'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:bg-[var(--muted)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--accent-purple)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--accent-purple)] transition-colors flex items-center space-x-1"
                                aria-label="Change language"
                            >
                                <Globe size={20} />
                                <span className="text-sm font-medium hidden sm:inline">
                                    {i18n.language.toUpperCase()}
                                </span>
                            </button>

                            {/* Language Dropdown */}
                            {isLangMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-[var(--card)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden z-10">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === lang.code
                                                    ? 'bg-[var(--accent-purple)] text-white'
                                                    : 'text-[var(--text-primary)] hover:bg-[var(--muted)]'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Account Section */}
                        {isAuthenticated && user ? (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-white font-bold text-sm">
                                        {user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {user.username}
                                    </span>
                                    <ChevronDown size={16} className="text-[var(--text-secondary)]" />
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden z-10">
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center space-x-2 px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--muted)] transition-colors"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>{t('nav.dashboard')}</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            <span>{t('nav.logout')}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg font-medium text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:bg-[var(--muted)] transition-colors"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg font-medium bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple-hover)] transition-colors"
                                >
                                    {t('nav.register')}
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--accent-purple)] transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--border-color)]">
                        <div className="flex flex-col space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(link.path)
                                            ? 'bg-[var(--accent-purple)] text-white'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:bg-[var(--muted)]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Mobile User Section */}
                            {isAuthenticated && user ? (
                                <>
                                    <div className="border-t border-[var(--border-color)] pt-2 mt-2">
                                        <div className="flex items-center space-x-2 px-4 py-2">
                                            <div className="w-8 h-8 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-white font-bold text-sm">
                                                {user.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                                {user.username}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-4 py-2 rounded-lg font-medium text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:bg-[var(--muted)] transition-colors flex items-center space-x-2"
                                    >
                                        <LayoutDashboard size={16} />
                                        <span>{t('nav.dashboard')}</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                                    >
                                        <LogOut size={16} />
                                        <span>{t('nav.logout')}</span>
                                    </button>
                                </>
                            ) : (
                                <div className="border-t border-[var(--border-color)] pt-2 mt-2 space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2 rounded-lg font-medium text-[var(--text-secondary)] hover:text-[var(--accent-purple)] hover:bg-[var(--muted)] transition-colors"
                                    >
                                        {t('nav.login')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-4 py-2 rounded-lg font-medium bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple-hover)] transition-colors text-center"
                                    >
                                        {t('nav.register')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
