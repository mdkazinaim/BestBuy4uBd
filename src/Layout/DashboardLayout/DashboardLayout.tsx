import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import { adminRoutes } from "@/routes/AdminRoutes";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print:bg-white overflow-x-hidden">
      {/* 1. Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-gray-700 lg:relative lg:translate-x-0 print:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="p-2 md:p-6 overflow-y-auto print:p-0 print:overflow-visible flex-1">
          {/* Breadcrumbs (Optional) */}
          <div className="print:hidden mb-4">
            <div className="flex items-center gap-2">
              <Breadcrumbs config={adminRoutes} basePath="/admin" />
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
