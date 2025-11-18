"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { cancelTokenRefreshTimer, startTokenRefreshTimer } from "@/services/authTimer";
import { useTokenManager } from "@/hooks/useTokenManager";
import { useIdleTimer } from "@/hooks/useIdleTimer";

interface Webinar {
  id: number;
  title: string;
  date: string;
  time?: string;
  meetingLink?: string;
  isRecurring: boolean;
  recurringType?: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  domain?: string;
  contact?: { primaryEmail?: string };
}

interface Package {
  id: number;
  name: string;
  description: string;
  coverImage?: string;
  paymentSettings?: {
    price: number;
    currency: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();

  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([]);
  const [latestStudents, setLatestStudents] = useState<Student[]>([]);
  const [latestPackage, setLatestPackage] = useState<Package | null>(null);
  const [earnings, setEarnings] = useState({
    currentMonth: 0,
    previousMonth: 0,
    totalStudents: 0,
    currentMonthName: "",
    previousMonthName: "",
  });

  const { remaining, tokenReady } = useTokenManager();
  const { showWarning, countdown } = useIdleTimer();

  useEffect(() => {
    startTokenRefreshTimer(); // auto-refresh access token
    return () => cancelTokenRefreshTimer();
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [webinarsRes, studentsRes, packageRes, earningsRes] =
        await Promise.all([
          api.get("/users/dashboard/upcoming-webinars"),
          api.get("/users/dashboard/latest-student"),
          api.get("/users/dashboard/latest-package"),
          api.get("/users/dashboard/earnings"),
        ]);

      // Normalize webinar data
      let allWebinars: Webinar[] = [];
      if (Array.isArray(webinarsRes.data)) allWebinars = webinarsRes.data;
      else if (webinarsRes.data?.webinars) allWebinars = webinarsRes.data.webinars;
      else if (webinarsRes.data?.data) allWebinars = webinarsRes.data.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(today.getDate() + 7);
      sevenDaysLater.setHours(23, 59, 59, 999);

      const filteredWebinars = allWebinars.filter((w) => {
        if (!w?.date) return false;
        const webinarDate = new Date(w.date);
        return webinarDate >= today && webinarDate <= sevenDaysLater;
      });

      setUpcomingWebinars(filteredWebinars);
      setLatestStudents(studentsRes.data || []);
      setLatestPackage(packageRes.data || null);
      setEarnings(
        earningsRes.data || {
          currentMonth: 0,
          previousMonth: 0,
          totalStudents: 0,
          currentMonthName: "",
          previousMonthName: "",
        }
      );
    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      await api.delete(`/packages/${id}`);
      window.location.reload();
    }
  };

  return (
    <div className="p-8 overflow-auto">
      {/* Token & Idle warnings */}
      {tokenReady && (
        <div className="fixed top-2 right-2 p-2 bg-gray-200 rounded shadow">
          ⏱️ Token refresh in: {remaining}s
        </div>
      )}
      {showWarning && (
        <div className="fixed bottom-2 right-2 p-4 bg-red-200 text-red-900 rounded shadow">
          ⚠️ You will be logged out in {countdown}s due to inactivity
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Webinars */}
        <div className="bg-white p-5 shadow rounded-lg hover:shadow-lg transition duration-200">
          <h2 className="text-lg font-semibold mb-3">Upcoming Webinars</h2>
          {upcomingWebinars.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {upcomingWebinars.map((w) => (
                <li key={w.id} className="border-b pb-2 last:border-b-0">
                  <p className="font-semibold">📅 {w.title}</p>
                  <p>🗓 Date: {new Date(w.date).toLocaleDateString()}</p>
                  <p>⏰ Time: {w.time || "-"}</p>
                  {w.isRecurring && w.recurringType && (
                    <p className="text-gray-500 italic">🔁 Recurring: {w.recurringType}</p>
                  )}
                  {w.meetingLink && (
                    <a
                      href={w.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      🔗 Join Link
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No webinars scheduled.</p>
          )}
        </div>

        {/* Latest Students */}
        <div className="bg-white p-5 shadow rounded-lg hover:shadow-lg transition duration-200">
          <h2 className="text-lg font-semibold mb-3">Latest Students</h2>
          {latestStudents.length > 0 ? (
            <ul className="space-y-1 text-sm text-gray-700">
              {latestStudents.map((s) => (
                <li key={s.id}>
                  👤 {s.firstName} {s.lastName} — <span className="italic">{s.domain}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No students registered yet.</p>
          )}
        </div>

        {/* Latest Package */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col">
          {latestPackage ? (
            <>
              <div className="relative w-full h-48 bg-gray-100">
                <img
                  src={latestPackage.coverImage || "/placeholder.png"}
                  alt={latestPackage.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{latestPackage.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{latestPackage.description}</p>
                <p className="text-lg font-bold text-gray-800 mb-4">
                  {latestPackage.paymentSettings?.currency || "₹"} {latestPackage.paymentSettings?.price || 0}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/packages/edit/${latestPackage.id}`)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(latestPackage.id)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/package-settings/${latestPackage.id}`)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/package-payment-settings/${latestPackage.id}`)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    💳 Payment
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="p-5 text-gray-500 text-sm">No package created yet.</p>
          )}
        </div>

        {/* Earnings */}
        <div className="bg-white p-5 shadow rounded-lg hover:shadow-lg transition duration-200">
          <h2 className="text-lg font-semibold mb-3">Earnings</h2>
          <div className="text-gray-700 text-sm space-y-1">
            <p>
              📆 {earnings.currentMonthName} :
              <span className="font-bold text-green-600"> ₹{earnings.currentMonth}</span>
            </p>
            <p>
              📅 {earnings.previousMonthName} :
              <span className="font-bold text-blue-600"> ₹{earnings.previousMonth}</span>
            </p>
            <p>
              👥 Total Students :
              <span className="font-bold text-purple-600"> {earnings.totalStudents}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
