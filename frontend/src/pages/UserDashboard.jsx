import React from 'react';
import useAuthStore from '../stores/authStore';
import { User, Heart, Map } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="bg-gray-900 min-h-screen p-8 text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 flex items-center space-x-6">
                    <div className="bg-blue-600 p-4 rounded-full">
                        <User size={48} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">{user?.username}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                        <p className="text-sm text-blue-400 mt-1 uppercase">{user?.roles?.join(', ')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <Heart className="text-red-500" />
                            <h3 className="text-xl font-semibold">Favorite Projects</h3>
                        </div>
                        <p className="text-gray-400">You haven't saved any projects yet.</p>
                        {/* Placeholder for favorites list */}
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            <Map className="text-green-500" />
                            <h3 className="text-xl font-semibold">Recent Tours</h3>
                        </div>
                        <p className="text-gray-400">No recent history.</p>
                        {/* Placeholder for history */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
