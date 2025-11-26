"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Truck,
  Wrench,
  BarChart,
  ChevronLeft,
  Sprout,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Inventory', href: '/dashboard/inventory' },
  { icon: Users, label: 'Customer Database', href: '/dashboard/customers' },
  { icon: DollarSign, label: 'Financial Record', href: '/dashboard/financial' },
  { icon: Truck, label: 'Supplier Record', href: '/dashboard/suppliers' },
  { icon: Wrench, label: 'Delivery and Maintenance Log', href: '/dashboard/delivery-maintenance' },
  { icon: BarChart, label: 'Marketing Tracker', href: '/dashboard/marketing' },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`h-screen w-64 bg-[#1a1f2c] text-white flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold text-green-500">ProGarden</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-[#2a303c] rounded-lg transition-colors lg:hidden"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  // On mobile, close sidebar when clicking a link
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#2a303c] text-white border-l-4 border-green-500'
                  : 'text-gray-400 hover:bg-[#2a303c] hover:text-white'
                  }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-green-500' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-[#2a303c] hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
