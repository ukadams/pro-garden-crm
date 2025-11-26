'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import SupplierModal from '@/components/supplier/SupplierModal';
import axios from 'axios';

interface Supplier {
    id: number;
    supplier_name: string;
    product_supplied?: string;
    contact?: string;
    payment_terms?: string;
    last_purchase?: string;
    amount_paid?: number;
    balance?: number;
    notes?: string;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | undefined>(undefined);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEdit = (supplier: Supplier) => {
        setSupplierToEdit(supplier);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSupplierToEdit(undefined);
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.product_supplied?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supplier Record</h1>
                    <p className="text-gray-500 mt-1">Manage your suppliers and track payments</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                    <Plus className="h-5 w-5" />
                    Add Supplier
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Supplied</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Purchase</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">No suppliers found</td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.supplier_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.product_supplied || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.contact || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.payment_terms || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.last_purchase || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦{(supplier.amount_paid || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₦{(supplier.balance || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{supplier.notes || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(supplier.id)}
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
            </div>

            <SupplierModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={fetchSuppliers}
                supplierToEdit={supplierToEdit}
            />
        </div>
    );
}
