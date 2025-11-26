"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, ShoppingCart, AlertTriangle, Plus, UserPlus } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState({
        users: 0,
        inventory: 0,
        orders: 0,
        revenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                await api.get('/');
                setStats({
                    users: 156,
                    inventory: 8,
                    orders: 12,
                    revenue: 45200
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
                        <p className="text-gray-500 mt-1">Here's what's happening with your business today</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            <Plus className="h-4 w-4" /> Add Stock
                        </button>
                        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            <ShoppingCart className="h-4 w-4" /> New Sale
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                            <UserPlus className="h-4 w-4" /> Add Customer
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Today's Sales</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">₦{stats.revenue.toLocaleString()}</h3>
                                    <p className="text-sm text-green-500 mt-1 font-medium">+12% from yesterday</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.inventory}</h3>
                                    <p className="text-sm text-red-500 mt-1 font-medium">Requires attention</p>
                                </div>
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</h3>
                                    <p className="text-sm text-green-500 mt-1 font-medium">3 ready for delivery</p>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stock Alerts */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Alerts</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium">
                                    <AlertTriangle className="h-4 w-4" />
                                    Tomato Seedlings - Only 5 units left
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium">
                                    <AlertTriangle className="h-4 w-4" />
                                    Fish Feed (Premium) - 2 bags remaining
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 text-orange-800 rounded-lg text-sm font-medium">
                                    <AlertTriangle className="h-4 w-4" />
                                    Garden Hose (50ft) - Out of stock
                                </div>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Tasks</h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Feed catfish in Pond A', time: 'Due: 9:00 AM', done: false },
                                    { title: 'Water seedlings in greenhouse', time: 'Completed: 7:30 AM', done: true },
                                    { title: 'Garden maintenance - Johnson residence', time: 'Due: 2:00 PM', done: false },
                                    { title: 'Harvest mature catfish - Pond C', time: 'Due: 4:00 PM', done: false },
                                ].map((task, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 border-b last:border-0">
                                        <input type="checkbox" checked={task.done} className="mt-1 rounded border-gray-300 text-green-500 focus:ring-green-500" readOnly />
                                        <div>
                                            <p className={`text-sm font-medium ${task.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{task.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Recent Orders */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                            <div className="space-y-4">
                                {[
                                    { id: '#1234', customer: 'Mrs. Adebayo', item: 'Pepper seedlings', status: 'Pending', color: 'bg-orange-100 text-orange-700' },
                                    { id: '#1235', customer: 'Mr. Johnson', item: 'Garden setup service', status: 'Processing', color: 'bg-blue-100 text-blue-700' },
                                    { id: '#1236', customer: 'Green Valley Farm', item: '50kg catfish', status: 'Completed', color: 'bg-green-100 text-green-700' },
                                ].map((order) => (
                                    <div key={order.id} className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-bold text-gray-900">Order {order.id}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.color}`}>{order.status}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">{order.customer} - {order.item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Overview */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Overview</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 mb-1">This Month Inflow</p>
                                    <p className="text-sm font-bold text-green-600">₦285,400</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <p className="text-xs text-gray-500 mb-1">This Month Outflow</p>
                                    <p className="text-sm font-bold text-red-600">₦142,800</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                                <p className="text-xl font-bold text-green-600">₦142,600</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
