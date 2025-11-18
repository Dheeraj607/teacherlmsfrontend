"use client";

import React from "react";
import { useIdleTimer } from "@/hooks/useIdleTimer";

export default function IdleTimerWarning() {
  // Use the custom hook
  const { showWarning, countdown } = useIdleTimer();

  // If no warning to show, return nothing
  if (!showWarning) return null;

  // ✅ Stay logged in — reset timer by refreshing the page
  const handleStayLoggedIn = () => {
    console.log("✅ User chose to stay logged in");
    window.location.reload(); // refresh to reset idle timer
  };

  // ✅ Logout immediately — clear data and redirect to main page
  const handleLogoutNow = () => {
    console.log("🔒 Logging out due to inactivity...");
    localStorage.clear();
    window.location.href = "/"; // redirect to main page (page.tsx)
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[92%] max-w-md">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          ⚠ Session Expiring
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          No activity detected. You will be logged out in{" "}
          <span className="font-bold text-lg">{countdown}</span> seconds.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleStayLoggedIn}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Stay Logged In
          </button>

          <button
            onClick={handleLogoutNow}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}
