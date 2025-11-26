'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Truck, Calendar, MapPin, Package, User, DollarSign, FileText, Edit2 } from 'lucide-react';
import axios from 'axios';
import DeliveryModal from '@/components/delivery/DeliveryModal';

interface DeliveryLog {
    id: number;
    date: string;
    customer_name: string;
    location: string;
    item_delivered: string;
    quantity: number;
    delivery_person: string;
    delivery_cost: number;
    notes: string;
}

export default function DeliveryMaintenancePage() {
    const [logs, setLogs] = useState<DeliveryLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<DeliveryLog | null>(null);

    const fetchLogs = async () => {
        try {
            const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await axios.get(`${url}/deliveries/`);
            setLogs(response.data);
        } catch (error) {
            console.error('Failed to fetch delivery logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleEdit = (log: DeliveryLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedLog(null);
        setIsModalOpen(true);
    };

    const filteredLogs = logs.filter(log =>
        log.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.item_delivered?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.delivery_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delivery and Maintenance Log</h1>
                    <p className="text-gray-700 mt-1">Track deliveries, schedules, and maintenance records.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                >
                    <Plus size={20} />
                    Add Log
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        Date
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        Customer Name
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        Location
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} />
                                        Item Delivered
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">Quantity</th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} />
                                        Delivery Person
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} />
                                        Cost (₦)
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} />
                                        Notes
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-600">
                                        Loading logs...
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-600">
                                        No delivery logs found.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-900">{log.date}</td>
                                        <td className="p-4 text-gray-900 font-medium">{log.customer_name}</td>
                                        <td className="p-4 text-gray-700">{log.location || '-'}</td>
                                        <td className="p-4 text-gray-700">{log.item_delivered || '-'}</td>
                                        <td className="p-4 text-gray-700">{log.quantity || '-'}</td>
                                        <td className="p-4 text-gray-700">{log.delivery_person || '-'}</td>
                                        <td className="p-4 text-gray-900 font-medium">
                                            {log.delivery_cost ? `₦${log.delivery_cost.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate" title={log.notes}>
                                            {log.notes || '-'}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleEdit(log)}
                                                className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Log"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeliveryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={fetchLogs}
                log={selectedLog}
            />
        </div>
    );
}
