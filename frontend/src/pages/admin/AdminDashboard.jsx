import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FolderOpen, FileText, Image, Box, Plus, Upload, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { title: "Total Projects", value: 0, icon: FolderOpen, color: "bg-blue-500" },
        { title: "Blog Posts", value: 0, icon: FileText, color: "bg-green-500" },
        { title: "360° Scenes", value: 0, icon: Image, color: "bg-yellow-500" },
        { title: "3D Models", value: 0, icon: Box, color: "bg-purple-500" }
    ]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Only fetch public data - no authentication required
            const projectsRes = await api.get('/projects');

            setStats(prevStats => prevStats.map(stat => {
                if (stat.title === "Total Projects") {
                    return { ...stat, value: projectsRes.data.length };
                }
                // Other stats would be fetched/calculated similarly
                return stat;
            }));

            setRecentProjects(projectsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setStats(prevStats => prevStats.map(stat => ({ ...stat, value: 0 })));
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide font-semibold">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
                    <Icon size={24} color={color} />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-[var(--border-color)] flex items-center">
                        <div className="p-4 rounded-full bg-opacity-10 mr-4" style={{ backgroundColor: stat.color.replace('bg-', '') }}>
                            <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--muted-foreground)]">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Projects */}
                <div className="lg:col-span-2 bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Projects</h2>
                        <button className="text-[var(--primary)] text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-[var(--border-color)]">
                                    <th className="pb-3 text-sm font-medium text-[var(--muted-foreground)]">Project Name</th>
                                    <th className="pb-3 text-sm font-medium text-[var(--muted-foreground)]">Category</th>
                                    <th className="pb-3 text-sm font-medium text-[var(--muted-foreground)]">Status</th>
                                    <th className="pb-3 text-sm font-medium text-[var(--muted-foreground)]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {recentProjects.map((project) => (
                                    <tr key={project.id} className="group hover:bg-[var(--muted)]/50 transition-colors">
                                        <td className="py-4 text-sm font-medium text-[var(--foreground)]">{project.title}</td>
                                        <td className="py-4 text-sm text-[var(--muted-foreground)]">{project.category?.nameEn || 'N/A'}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.featured ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400'}`}>
                                                {project.featured ? 'Featured' : 'Normal'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-[var(--muted-foreground)]">{new Date(project.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border-color)] p-6">
                    <h2 className="text-lg font-bold text-[var(--foreground)] mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
                            <Plus size={18} className="mr-2" /> New Project
                        </button>
                        <button className="w-full py-3 px-4 bg-[var(--muted)] text-[var(--foreground)] rounded-lg font-medium hover:bg-[var(--border-color)] transition-colors flex items-center justify-center">
                            <Upload size={18} className="mr-2" /> Upload Assets
                        </button>
                        <button className="w-full py-3 px-4 bg-[var(--muted)] text-[var(--foreground)] rounded-lg font-medium hover:bg-[var(--border-color)] transition-colors flex items-center justify-center">
                            <Settings size={18} className="mr-2" /> System Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
