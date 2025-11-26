import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface DeliveryLog {
    id?: number;
    date: string;
    customer_name: string;
    location?: string;
    item_delivered?: string;
    quantity?: number;
    delivery_person?: string;
    delivery_cost?: number;
    notes?: string;
}

interface DeliveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    log?: DeliveryLog | null;
}

export default function DeliveryModal({ isOpen, onClose, onSave, log }: DeliveryModalProps) {
    const [formData, setFormData] = useState<DeliveryLog>({
        date: new Date().toISOString().split('T')[0],
        customer_name: '',
        location: '',
        item_delivered: '',
        quantity: 0,
        delivery_person: '',
        delivery_cost: 0,
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (log) {
            setFormData({
                ...log,
                date: log.date || new Date().toISOString().split('T')[0],
                location: log.location || '',
                item_delivered: log.item_delivered || '',
                quantity: log.quantity || 0,
                delivery_person: log.delivery_person || '',
                delivery_cost: log.delivery_cost || 0,
                notes: log.notes || ''
            });
        } else {
            setFormData({
                date: new Date().toISOString().split('T')[0],
                customer_name: '',
                location: '',
                item_delivered: '',
                quantity: 0,
                delivery_person: '',
                delivery_cost: 0,
                notes: ''
            });
        }
        setError('');
    }, [log, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                quantity: formData.quantity ? Number(formData.quantity) : null,
                delivery_cost: formData.delivery_cost ? Number(formData.delivery_cost) : null,
            };

            const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            if (log?.id) {
                await axios.put(`${url}/deliveries/${log.id}`, payload);
            } else {
                await axios.post(`${url}/deliveries/`, payload);
            }
            onSave();
            onClose();
        } catch (err: any) {
            console.error('Failed to save delivery log:', err);
            setError(err.response?.data?.detail || 'Failed to save delivery log. Please check your input.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {log ? 'Edit Delivery Log' : 'Add Delivery Log'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Date *</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Customer Name *</label>
                            <input
                                type="text"
                                name="customer_name"
                                required
                                value={formData.customer_name}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-600 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Delivery location"
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-600 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Item Delivered</label>
                            <input
                                type="text"
                                name="item_delivered"
                                value={formData.item_delivered}
                                onChange={handleChange}
                                placeholder="Item name"
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-600 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Delivery Person</label>
                            <input
                                type="text"
                                name="delivery_person"
                                value={formData.delivery_person}
                                onChange={handleChange}
                                placeholder="Name of delivery person"
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-600 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Delivery Cost (₦)</label>
                            <input
                                type="number"
                                name="delivery_cost"
                                value={formData.delivery_cost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-gray-900 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Additional notes..."
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-600 font-medium"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors flex items-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Log
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
