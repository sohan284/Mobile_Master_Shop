'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserInfo from '@/components/UserInfo';
import Sidebar from './components/Sidebar';
import NotificationDropdown from './components/NotificationDropdown';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-secondary  shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-primary hover:text-primary hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div></div>
            {/* <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1> */}
            <div className="flex items-center gap-4">
              {/* <NotificationDropdown /> */}
              <UserInfo />
            </div>
          </div>
          
          {/* Page content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
