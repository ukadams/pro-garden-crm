"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface DashboardStats {
  total_sales: number;
  total_expenses: number;
  net_profit: number;
  total_customers: number;
  repeat_customers: number;
  income: number;
  expenses: number;
}

interface SalesTrendData {
  date: string;
  amount: number;
}

interface ExpenseBreakdown {
  category: string;
  amount: number;
  [key: string]: any;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const [statsRes, trendRes, breakdownRes] = await Promise.all([
        axios.get(`${url}/dashboard/stats`),
        axios.get(`${url}/dashboard/sales-trend?days=30`),
        axios.get(`${url}/dashboard/expense-breakdown`)
      ]);

      setStats(statsRes.data);
      setSalesTrend(trendRes.data);
      setExpenseBreakdown(breakdownRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const monthlyComparison = stats ? [
    { name: "Income", value: stats.income, fill: "#10b981" },
    { name: "Expenses", value: stats.expenses, fill: "#ef4444" }
  ] : [];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700 mt-1 font-medium">Financial overview and business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Total Sales</p>
                <h3 className="text-2xl font-bold text-green-700">
                  ₦{stats?.total_sales.toLocaleString() || "0"}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Total Expenses</p>
                <h3 className="text-2xl font-bold text-red-700">
                  ₦{stats?.total_expenses.toLocaleString() || "0"}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Net Profit</p>
                <h3 className={`text-2xl font-bold ${(stats?.net_profit || 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
                  ₦{stats?.net_profit.toLocaleString() || "0"}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Total Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.total_customers || 0}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Repeat Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.repeat_customers || 0}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">Sales Trend (Last 30 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontWeight: 600
                  }}
                />
                <Legend wrapperStyle={{ fontWeight: 600 }} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Sales (₦)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-900">This Month: Income vs Expenses</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontWeight: 600
                  }}
                />
                <Legend wrapperStyle={{ fontWeight: 600 }} />
                <Bar dataKey="value" name="Amount (₦)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {expenseBreakdown.length > 0 && (
          <Card className="border-none shadow-sm bg-white border border-gray-200 lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Expense Breakdown by Category</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontWeight: 600
                    }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
