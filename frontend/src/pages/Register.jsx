import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    // ===== VALIDATION LOGIC =====
    const validate = () => {
        const newErrors = {};

        if (username.length < 3) {
            newErrors.username = 'Username phải có ít nhất 3 ký tự';
        } else if (username.length > 20) {
            newErrors.username = 'Username không được vượt quá 20 ký tự';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Email không đúng định dạng';
        }

        if (password.length < 6) {
            newErrors.password = 'Password phải có ít nhất 6 ký tự';
        } else if (password.length > 40) {
            newErrors.password = 'Password không được vượt quá 40 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await register(username, email, password);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>

                {/* BACKEND ERROR (nếu có) */}
                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* USERNAME */}
                    <div>
                        <label className="block text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                                errors.username ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                        />
                        {errors.username && (
                            <span className="text-red-400 text-sm mt-1 block">
                                {errors.username}
                            </span>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                                errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                        />
                        {errors.email && (
                            <span className="text-red-400 text-sm mt-1 block">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                                errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                        />
                        {errors.password && (
                            <span className="text-red-400 text-sm mt-1 block">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
