"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, Trash2, Edit2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

interface Category {
    id: string;
    name: string;
}

interface Material {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    categoryId: string;
    category?: Category;
    createdAt?: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode: 'create' | 'edit' | 'view';
    material?: Material;
}

export default function ProductModal({
    isOpen,
    onClose,
    onSuccess,
    mode,
    material,
}: ProductModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Dialog and Toast states
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({
        title: "",
        message: "",
        type: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (mode === 'edit' && material) {
                setTitle(material.title);
                setDescription(material.description);
                setCategoryId(material.categoryId);
                setImagePreview(material.imageUrl);
            } else {
                resetForm();
            }
        }
    }, [isOpen, mode, material]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/category');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategoryId("");
        setImage(null);
        setImagePreview("");
        setError("");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to manage products');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('categoryId', categoryId);

            if (image) {
                formData.append('image', image);
            }

            const url = mode === 'edit' && material
                ? `http://localhost:5000/api/material/${material.id}`
                : 'http://localhost:5000/api/material';

            const method = mode === 'edit' ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product');
            }

            // Show success toast
            setToastConfig({
                title: mode === 'create' ? 'Product Created!' : 'Product Updated!',
                message: mode === 'create' ? 'Your product has been created successfully.' : 'Your product has been updated successfully.',
                type: 'success'
            });
            setShowToast(true);

            onSuccess();
            onClose();
            resetForm();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            setToastConfig({
                title: 'Error',
                message: err.message || 'An error occurred',
                type: 'error'
            });
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!material) return;

        setShowDeleteConfirm(false);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/material/${material.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            // Show success toast
            setToastConfig({
                title: 'Product Deleted!',
                message: 'The product has been deleted successfully.',
                type: 'success'
            });
            setShowToast(true);

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to delete product');
            setToastConfig({
                title: 'Delete Failed',
                message: err.message || 'Failed to delete product',
                type: 'error'
            });
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#161616] border border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-[#161616] border-b border-gray-800 p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {mode === 'create' ? 'Add New Product' : mode === 'edit' ? 'Edit Product' : 'Product Details'}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {mode === 'create' ? 'Fill in the details to add a new product' : 'Update product information'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-300">Product Image</label>
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-2xl border border-gray-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview("");
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-700 rounded-2xl hover:border-[#D4AF37] transition-colors cursor-pointer bg-[#0F0F0F] group">
                                    <Upload className="w-12 h-12 text-gray-600 group-hover:text-[#D4AF37] transition-colors" />
                                    <p className="mt-3 text-sm text-gray-400 group-hover:text-gray-300">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP up to 10MB</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        {mode === 'edit' && !image && (
                            <p className="text-xs text-gray-500">Leave empty to keep the existing image</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-300">Product Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#0F0F0F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                            placeholder="Enter product title"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-300">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-[#0F0F0F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                            required
                        >
                            <option value="" style={{ backgroundColor: '#1a1a1a', color: '#9ca3af' }}>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-[#0F0F0F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all resize-none"
                            placeholder="Enter product description"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        {mode === 'edit' && (
                            <button
                                type="button"
                                onClick={handleDeleteClick}
                                disabled={loading}
                                className="flex items-center space-x-2 bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all border border-red-500/20 disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        )}
                        <div className={`flex space-x-3 ${mode === 'create' ? 'ml-auto' : ''}`}>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all border border-gray-800 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 bg-[#D4AF37] text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#B8860B] transition-all shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{mode === 'create' ? 'Creating...' : 'Updating...'}</span>
                                    </>
                                ) : (
                                    <span>{mode === 'create' ? 'Create Product' : 'Update Product'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 20px;
          border: 2px solid #0a0a0a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a2a2a;
        }
      `}</style>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                loading={loading}
            />

            {/* Toast Notification */}
            <Toast
                isOpen={showToast}
                onClose={() => setShowToast(false)}
                title={toastConfig.title}
                message={toastConfig.message}
                type={toastConfig.type}
                duration={3000}
            />
        </div>
    );
}
