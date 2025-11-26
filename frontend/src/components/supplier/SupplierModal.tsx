import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    supplierToEdit?: any;
}

export default function SupplierModal({ isOpen, onClose, onSuccess, supplierToEdit }: SupplierModalProps) {
    const [formData, setFormData] = useState({
        supplier_name: '',
        product_supplied: '',
        contact: '',
        payment_terms: '',
        last_purchase: '',
        amount_paid: 0,
        balance: 0,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (supplierToEdit) {
            setFormData({
                supplier_name: supplierToEdit.supplier_name || '',
                product_supplied: supplierToEdit.product_supplied || '',
                contact: supplierToEdit.contact || '',
                payment_terms: supplierToEdit.payment_terms || '',
                last_purchase: supplierToEdit.last_purchase || '',
                amount_paid: supplierToEdit.amount_paid || 0,
                balance: supplierToEdit.balance || 0,
                notes: supplierToEdit.notes || ''
            });
        } else {
            setFormData({
                supplier_name: '',
                product_supplied: '',
                contact: '',
                payment_terms: '',
                last_purchase: '',
                amount_paid: 0,
                balance: 0,
                notes: ''
            });
        }
    }, [supplierToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount_paid' || name === 'balance'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = supplierToEdit
                ? `${process.env.NEXT_PUBLIC_API_URL}/suppliers/${supplierToEdit.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/suppliers/`;

            const method = supplierToEdit ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                last_purchase: formData.last_purchase || null
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || 'Failed to save supplier');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to save supplier. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}
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
                        {/* Supplier Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-1">Supplier Name</label>
                            <input
                                type="text"
                                name="supplier_name"
                                required
                                value={formData.supplier_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="Enter supplier name"
                            />
                        </div>

                        {/* Product Supplied */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Product Supplied</label>
                            <input
                                type="text"
                                name="product_supplied"
                                value={formData.product_supplied}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="e.g. Fertilizer"
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Contact</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="Phone or Email"
                            />
                        </div>

                        {/* Payment Terms */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Payment Terms</label>
                            <input
                                type="text"
                                name="payment_terms"
                                value={formData.payment_terms}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                                placeholder="e.g. Net 30"
                            />
                        </div>

                        {/* Last Purchase */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Last Purchase</label>
                            <input
                                type="date"
                                name="last_purchase"
                                value={formData.last_purchase}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Amount Paid */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Amount Paid (₦)</label>
                            <input
                                type="number"
                                name="amount_paid"
                                min="0"
                                step="0.01"
                                value={formData.amount_paid}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Balance */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Balance (₦)</label>
                            <input
                                type="number"
                                name="balance"
                                min="0"
                                step="0.01"
                                value={formData.balance}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-1">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-gray-600 resize-none"
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {loading ? 'Saving...' : (supplierToEdit ? 'Update Supplier' : 'Add Supplier')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
