"use client";

import Sidebar from "@/app/components/sidebar";
import IdleTimerWarning from "@/app/components/IdleTimerWarning";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto relative">
        {/* Idle Timer Warning Overlay */}
        <IdleTimerWarning />

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
