"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Users, DollarSign, TrendingUp } from 'lucide-react';
import { customerAPI } from '@/lib/api';
import CustomerModal from '@/components/customer/CustomerModal';

interface Customer {
    id: number;
    customer_name: string;
    phone_number: string;
    address?: string;
    product_purchased?: string;
    quantity?: number;
    total_amount?: number;
    purchase_date?: string;
    payment_status?: string;
    payment_method?: string;
    delivery_status?: string;
    notes?: string;
    customer_type?: string;
    channel?: string;
    preferred_product?: string;
    follow_up_date?: string;
}

export default function CustomerDatabasePage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        try {
            const response = await customerAPI.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleEdit = (customer: Customer) => {
        setCustomerToEdit(customer);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerAPI.delete(id);
                fetchCustomers();
            } catch (error) {
                console.error('Failed to delete customer:', error);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        // Delay resetting customerToEdit to avoid interfering with save
        setTimeout(() => setCustomerToEdit(null), 100);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.product_purchased?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = customers.reduce((acc, c) => acc + (c.total_amount || 0), 0);
    const returningCustomers = customers.filter(c => c.customer_type === 'Returning').length;


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Database</h1>
                    <p className="text-gray-500 mt-1">Manage your customer relationships and track purchases</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add New Customer
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Customers</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{customers.length}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Returning Customers</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{returningCustomers}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-purple-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                ₦{totalRevenue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers, phone, or products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (₦)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-Up</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                                        No customers found. Add your first customer!
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{customer.customer_name}</div>
                                            <div className="text-xs text-gray-500">{customer.customer_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.product_purchased || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.quantity || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.total_amount?.toLocaleString() || '0'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${customer.payment_status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                customer.payment_status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {customer.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.payment_method || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${customer.delivery_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                customer.delivery_status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {customer.delivery_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.channel || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {customer.follow_up_date ? new Date(customer.follow_up_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(customer)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div >

            <CustomerModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={fetchCustomers}
                customerToEdit={customerToEdit}
            />
        </div >
    );
}
