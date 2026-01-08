import React, { useState, useEffect } from 'react';
import * as categoriesService from '../../services/categories.service';
import { Edit, Trash2, Plus, Layers } from 'lucide-react';
import Modal from '../../components/admin/Modal';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE'); // CREATE or EDIT
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        nameVi: '',
        nameEn: '',
        slug: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = () => {
        setModalMode('CREATE');
        setFormData({ nameVi: '', nameEn: '', slug: '' });
        setShowModal(true);
    };

    const handleEdit = (category) => {
        setModalMode('EDIT');
        setCurrentId(category.id);
        setFormData({
            nameVi: category.nameVi,
            nameEn: category.nameEn,
            slug: category.slug
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoriesService.remove(id);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'CREATE') {
                await categoriesService.create({
                    nameVi: formData.nameVi,
                    nameEn: formData.nameEn
                });
            } else {
                await categoriesService.update(currentId, {
                    nameVi: formData.nameVi,
                    nameEn: formData.nameEn
                });
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data || 'Failed to save category');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers size={24} /> Category Management
                </h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#9b4dff] text-white rounded-lg hover:bg-[#8a3ee6] transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name (VI)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name (EN)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {category.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {category.nameVi}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {category.nameEn}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalMode === 'CREATE' ? 'Add Category' : 'Edit Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name (Vietnamese)</label>
                        <input
                            type="text"
                            name="nameVi"
                            value={formData.nameVi}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name (English)</label>
                        <input
                            type="text"
                            name="nameEn"
                            value={formData.nameEn}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
                        <input
                            type="text"
                            value={modalMode === 'CREATE' ? 'Auto-generated from Name (EN)' : formData.slug}
                            readOnly
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 text-gray-500 shadow-sm sm:text-sm p-2 border cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">Slug is automatically generated from English Name.</p>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#9b4dff] hover:bg-[#8a3ee6] rounded-md shadow-sm"
                        >
                            {modalMode === 'CREATE' ? 'Create' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminCategories;
