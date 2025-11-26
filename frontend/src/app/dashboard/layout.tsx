"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
          }`}
      >
        <div className="p-4 md:p-8">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors hidden lg:block"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {children}
        </div>
      </main>
    </div>
  )
}
