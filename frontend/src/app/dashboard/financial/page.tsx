'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { financialAPI } from '@/lib/api';
import FinancialModal from '@/components/financial/FinancialModal';

interface FinancialRecord {
    id: number;
    date: string;
    transaction_type: string;
    description?: string;
    category?: string;
    amount: number;
    payment_method?: string;
    status?: string;
    notes?: string;
    customer_id?: number;
    customer_name?: string;
}

export default function FinancialPage() {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | undefined>(undefined);

    const fetchRecords = async () => {
        try {
            const response = await financialAPI.getAll();
            setRecords(response.data);
        } catch (error) {
            console.error('Failed to fetch financial records:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await financialAPI.delete(id);
                fetchRecords();
            } catch (error) {
                console.error('Failed to delete record:', error);
            }
        }
    };

    const handleEdit = (record: FinancialRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedRecord(undefined);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedRecord(undefined);
    };

    const handleModalSave = () => {
        fetchRecords();
    };

    const filteredRecords = records.filter(record =>
        record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalIncome = records.filter(r => r.transaction_type === 'Income').reduce((acc, r) => acc + r.amount, 0);
    const totalExpense = records.filter(r => r.transaction_type === 'Expense').reduce((acc, r) => acc + r.amount, 0);
    const netProfit = totalIncome - totalExpense;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Financial Records</h1>
                    <p className="text-gray-700 mt-1 font-medium">Track income and expenses</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Record
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-900 font-bold">Total Income</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">₦{totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-900 font-bold">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">₦{totalExpense.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <TrendingDown className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-900 font-bold">Net Profit</p>
                            <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₦{netProfit.toLocaleString()}
                            </p>
                        </div>
                        <div className={`p-3 rounded-lg ${netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            <DollarSign className={`h-6 w-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Transaction Type</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount (₦)</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Payment Method</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Notes</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-900 font-medium">
                                        Loading records...
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-900 font-medium">
                                        No financial records found. Add your first record!
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.transaction_type === 'Income'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {record.transaction_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            <div>{record.description || '-'}</div>
                                            {record.customer_name && (
                                                <div className="text-xs text-gray-700 font-medium">Customer: {record.customer_name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.category || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            {record.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.payment_method || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                record.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {record.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">{record.notes || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.id)}
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

            {/* Modal */}
            <FinancialModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
                record={selectedRecord}
            />
        </div>
    );
}
