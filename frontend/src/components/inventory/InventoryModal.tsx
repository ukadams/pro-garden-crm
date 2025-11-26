import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { inventoryAPI } from '@/lib/api';

interface InventoryItem {
    id?: number;
    item_name: string;
    category: string;
    quantity_in_stock: number;
    unit: string;
    cost_price: number;
    selling_price: number;
    supplier: string;
    restock_level: number;
    status: string;
    date_added?: string;
}

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: InventoryItem | null;
}

export default function InventoryModal({ isOpen, onClose, onSuccess, itemToEdit }: InventoryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<InventoryItem>({
        item_name: '',
        category: '',
        quantity_in_stock: 0,
        unit: '',
        cost_price: 0,
        selling_price: 0,
        supplier: '',
        restock_level: 5,
        status: 'In Stock'
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData(itemToEdit);
        } else {
            setFormData({
                item_name: '',
                category: '',
                quantity_in_stock: 0,
                unit: '',
                cost_price: 0,
                selling_price: 0,
                supplier: '',
                restock_level: 5,
                status: 'In Stock'
            });
        }
        setError('');
    }, [itemToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity_in_stock' || name === 'cost_price' || name === 'selling_price' || name === 'restock_level'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (itemToEdit && itemToEdit.id) {
                await inventoryAPI.update(itemToEdit.id, formData);
            } else {
                await inventoryAPI.create(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to save inventory item:', err);
            setError(err.response?.data?.detail || 'Failed to save inventory item. Please check your input.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {itemToEdit ? 'Edit Inventory Item' : 'Add New Item'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Item Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-1">Item Name *</label>
                            <input
                                type="text"
                                name="item_name"
                                required
                                value={formData.item_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="e.g. Tomato Seeds"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            >
                                <option value="">Select Category</option>
                                <option value="Seeds">Seeds</option>
                                <option value="Fertilizer">Fertilizer</option>
                                <option value="Tools">Tools</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Pesticides">Pesticides</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Supplier */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Supplier</label>
                            <input
                                type="text"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="e.g. Green Valley Suppliers"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Quantity in Stock *</label>
                            <input
                                type="number"
                                name="quantity_in_stock"
                                required
                                min="0"
                                value={formData.quantity_in_stock}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Unit */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Unit</label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="e.g. kg, bags, pcs"
                            />
                        </div>

                        {/* Cost Price */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Cost Price (₦) *</label>
                            <input
                                type="number"
                                name="cost_price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.cost_price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Selling Price */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Selling Price (₦) *</label>
                            <input
                                type="number"
                                name="selling_price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.selling_price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Restock Level */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Restock Level</label>
                            <input
                                type="number"
                                name="restock_level"
                                min="0"
                                value={formData.restock_level}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            >
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Item
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
