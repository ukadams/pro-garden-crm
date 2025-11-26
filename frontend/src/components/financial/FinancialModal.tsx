'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { financialAPI, customerAPI } from '@/lib/api';

interface FinancialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    record?: any;
}

export default function FinancialModal({ isOpen, onClose, onSave, record }: FinancialModalProps) {
    const [customers, setCustomers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        date: '',
        transaction_type: 'Income',
        description: '',
        category: '',
        amount: '',
        payment_method: '',
        status: 'Pending',
        notes: '',
        customer_id: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchCustomers();
            if (record) {
                setFormData({
                    date: record.date || '',
                    transaction_type: record.transaction_type || 'Income',
                    description: record.description || '',
                    category: record.category || '',
                    amount: record.amount?.toString() || '',
                    payment_method: record.payment_method || '',
                    status: record.status || 'Pending',
                    notes: record.notes || '',
                    customer_id: record.customer_id?.toString() || '',
                });
            } else {
                // Reset form for new record
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    transaction_type: 'Income',
                    description: '',
                    category: '',
                    amount: '',
                    payment_method: '',
                    status: 'Pending',
                    notes: '',
                    customer_id: '',
                });
            }
        }
    }, [isOpen, record]);

    const fetchCustomers = async () => {
        try {
            const response = await customerAPI.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    };

    const handleCustomerChange = (customerId: string) => {
        setFormData({ ...formData, customer_id: customerId });

        if (customerId) {
            const customer = customers.find(c => c.id === parseInt(customerId));
            if (customer) {
                // Auto-populate fields from customer
                setFormData(prev => ({
                    ...prev,
                    customer_id: customerId,
                    date: customer.purchase_date || prev.date,
                    description: `Sale to ${customer.customer_name} - ${customer.product_purchased || 'Product'}`,
                    category: 'Sales',
                    amount: customer.total_amount?.toString() || prev.amount,
                    payment_method: customer.payment_status || prev.payment_method,
                    status: customer.payment_status || prev.status,
                    notes: customer.notes || prev.notes,
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                amount: parseFloat(formData.amount),
                customer_id: formData.customer_id ? parseInt(formData.customer_id) : null,
                description: formData.description || null,
                category: formData.category || null,
                payment_method: formData.payment_method || null,
                notes: formData.notes || null,
            };

            if (record) {
                await financialAPI.update(record.id, submitData);
            } else {
                await financialAPI.create(submitData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to save financial record:', error);
            alert('Failed to save record. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {record ? 'Edit Financial Record' : 'Add Financial Record'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Customer Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Link to Customer (Optional)
                        </label>
                        <select
                            value={formData.customer_id}
                            onChange={(e) => handleCustomerChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                        >
                            <option value="">-- No Customer --</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.customer_name} - {customer.phone_number}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-700 mt-1 font-medium">
                            Select a customer to auto-fill transaction details
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                            />
                        </div>

                        {/* Transaction Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Transaction Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.transaction_type}
                                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                            >
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                            placeholder="e.g., Sale of fertilizer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                                placeholder="e.g., Sales, Supplies"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Amount (₦) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Payment Method
                            </label>
                            <input
                                type="text"
                                value={formData.payment_method}
                                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                                placeholder="e.g., Cash, Transfer"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-gray-900"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {record ? 'Update' : 'Create'} Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
