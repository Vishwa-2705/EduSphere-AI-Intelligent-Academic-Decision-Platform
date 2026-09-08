import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-lavender-50 font-serif">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 bg-lavender-50 p-6 text-slate-900 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-screen-2xl space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
