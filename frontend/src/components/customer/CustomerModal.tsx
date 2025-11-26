import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { customerAPI } from '@/lib/api';

interface Customer {
    id?: number;
    customer_name: string;
    phone_number: string;
    address?: string;
    product_purchased?: string;
    quantity?: number;
    total_amount?: number;
    payment_status?: string;
    payment_method?: string;
    delivery_status?: string;
    notes?: string;
    customer_type?: string;
    channel?: string;
    preferred_product?: string;
    follow_up_date?: string;
    purchase_date?: string;
}

interface CustomerFormData {
    customer_name: string;
    phone_number: string;
    address: string;
    product_purchased: string;
    quantity: number;
    total_amount: number;
    payment_status: string;
    payment_method: string;
    delivery_status: string;
    notes: string;
    customer_type: string;
    channel: string;
    preferred_product: string;
    follow_up_date: string;
    purchase_date: string;
}

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    customerToEdit?: Customer | null;
}

export default function CustomerModal({ isOpen, onClose, onSuccess, customerToEdit }: CustomerModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CustomerFormData>({
        customer_name: '',
        phone_number: '',
        address: '',
        product_purchased: '',
        quantity: 0,
        total_amount: 0,
        payment_status: 'Pending',
        payment_method: '',
        delivery_status: 'Pending',
        notes: '',
        customer_type: 'New',
        channel: '',
        preferred_product: '',
        follow_up_date: '',
        purchase_date: ''
    });

    useEffect(() => {
        if (customerToEdit) {
            setFormData({
                customer_name: customerToEdit.customer_name || '',
                phone_number: customerToEdit.phone_number || '',
                address: customerToEdit.address || '',
                product_purchased: customerToEdit.product_purchased || '',
                quantity: customerToEdit.quantity || 0,
                total_amount: customerToEdit.total_amount || 0,
                payment_status: customerToEdit.payment_status || 'Pending',
                payment_method: customerToEdit.payment_method || '',
                delivery_status: customerToEdit.delivery_status || 'Pending',
                notes: customerToEdit.notes || '',
                customer_type: customerToEdit.customer_type || 'New',
                channel: customerToEdit.channel || '',
                preferred_product: customerToEdit.preferred_product || '',
                follow_up_date: customerToEdit.follow_up_date || '',
                purchase_date: customerToEdit.purchase_date || ''
            });
        } else {
            setFormData({
                customer_name: '',
                phone_number: '',
                address: '',
                product_purchased: '',
                quantity: 0,
                total_amount: 0,
                payment_status: 'Pending',
                payment_method: '',
                delivery_status: 'Pending',
                notes: '',
                customer_type: 'New',
                channel: '',
                preferred_product: '',
                follow_up_date: '',
                purchase_date: ''
            });
        }
    }, [customerToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'total_amount'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Convert empty strings to null for optional fields
            const submitData = {
                ...formData,
                follow_up_date: formData.follow_up_date || null,
                purchase_date: formData.purchase_date || null,
                address: formData.address || null,
                product_purchased: formData.product_purchased || null,
                notes: formData.notes || null,
                channel: formData.channel || null,
                preferred_product: formData.preferred_product || null,
            };

            if (customerToEdit && customerToEdit.id) {
                await customerAPI.update(customerToEdit.id, submitData);
            } else {
                await customerAPI.create(submitData);
            }
            await onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save customer:', error);
            alert('Failed to save customer. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Customer Name *</label>
                            <input
                                type="text"
                                name="customer_name"
                                required
                                value={formData.customer_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone_number"
                                required
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. +234 800 000 0000"
                            />
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Customer address"
                            />
                        </div>
                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Total Amount */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Total Amount (₦)</label>
                            <input
                                type="number"
                                name="total_amount"
                                min="0"
                                step="0.01"
                                value={formData.total_amount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Payment Status */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Payment Status</label>
                            <select
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Partial">Partial</option>
                            </select>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Payment Method</label>
                            <input
                                type="text"
                                name="payment_method"
                                value={formData.payment_method || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. Cash, Transfer"
                            />
                        </div>

                        {/* Delivery Status */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Delivery Status</label>
                            <select
                                name="delivery_status"
                                value={formData.delivery_status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>

                        {/* Customer Type */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Customer Type</label>
                            <select
                                name="customer_type"
                                value={formData.customer_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            >
                                <option value="New">New</option>
                                <option value="Returning">Returning</option>
                            </select>
                        </div>

                        {/* Channel */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Channel</label>
                            <select
                                name="channel"
                                value={formData.channel}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            >
                                <option value="">Select Channel</option>
                                <option value="Walk-in">Walk-in</option>
                                <option value="Phone">Phone</option>
                                <option value="Online">Online</option>
                                <option value="Referral">Referral</option>
                            </select>
                        </div>

                        {/* Preferred Product */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Preferred Product</label>
                            <input
                                type="text"
                                name="preferred_product"
                                value={formData.preferred_product}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. Organic Fertilizer"
                            />
                        </div>

                        {/* Follow-up Date */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Follow-Up Date</label>
                            <input
                                type="date"
                                name="follow_up_date"
                                value={formData.follow_up_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-900 mb-1">Notes / Follow-up Comments</label>
                            <textarea
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                placeholder="Additional notes or comments..."
                            />
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
                                    Save Customer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
