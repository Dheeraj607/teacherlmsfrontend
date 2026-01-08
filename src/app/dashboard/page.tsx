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
useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    router.replace("/");
    return;
  }

  startTokenRefreshTimer(); // ✅ START refresh timer
  loadDashboardData();      // ✅ Load dashboard data

  return () => {
    cancelTokenRefreshTimer(); // ✅ STOP refresh on unmount
  };
}, []);

//  useEffect(() => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       router.replace("/");  // redirect instantly
//       return;               // ⛔ no API call
//     }

//     loadDashboardData();    // only run if token exists
//   }, []);




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
const [packageOpen, setPackageOpen] = useState(false);

  // useEffect(() => {
  //   startTokenRefreshTimer(); // auto-refresh access token
  //   return () => cancelTokenRefreshTimer();
  // }, []);

  // useEffect(() => {
  //   loadDashboardData();
  // }, []);

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

const filteredWebinars = allWebinars
  .filter((w) => {
    if (!w?.date) return false;
    const webinarDate = new Date(w.date);
    return webinarDate >= today && webinarDate <= sevenDaysLater;
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // soonest first
  .slice(0, 3); // only 3 webinars

setUpcomingWebinars(filteredWebinars);


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
    <div className="p-8 overflow-auto font-sans space-y-10">
      {/* Token & Idle warnings */}
      {tokenReady && (
        <div className="fixed top-2 right-2 p-2 bg-gray-200 rounded shadow">
          {/* ⏱️ Token refresh in: {remaining}s */}
        </div>
      )}
      {showWarning && (
        <div className="fixed bottom-2 right-2 p-4 bg-red-200 text-red-900 rounded shadow">
          ⚠️ You will be logged out in {countdown}s due to inactivity
        </div>
      )}

      {/* Dashboard Heading */}
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      {/* Upcoming Webinars */}
      <div className="mb-10">
        <h4 className="text-lg font-semibold mb-4">Upcoming Webinars</h4>
        {upcomingWebinars.length === 0 ? (
          <p className="text-gray-500 text-sm">No webinars scheduled.</p>
        ) : (
          <div className="flex flex-wrap -mx-3">
            {upcomingWebinars.slice(0, 3).map((w) => (
              <div key={w.id} className="w-full sm:w-1/3 px-3 mb-6 flex">
                <div className="flex-1 flex flex-col h-full bg-white rounded-2xl shadow-md border overflow-hidden p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">{w.title}</h5>
                  <div className="flex gap-2 text-gray-700 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{new Date(w.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>⏰</span>
                      <span>{w.time || "-"}</span>
                    </div>
                  </div>
                  {w.isRecurring && w.recurringType && (
                    <p className="text-gray-500 italic text-sm mb-2">
                      Recurring: {w.recurringType}
                    </p>
                  )}
                  {w.meetingLink ? (
                    <a
                      href={w.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto btn btn-primary w-full text-center"
                    >
                      Join Meeting
                    </a>
                  ) : (
                    <button
                      className="mt-auto btn btn-secondary w-full text-center"
                      disabled
                    >
                      No Link
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latest Package */}
      <div className="flex flex-wrap -mx-3 ">
        <div className="w-full md:w-1/3 px-3">
          <div className="card relative border rounded-lg shadow-md flex flex-col overflow-hidden h-full">
            {latestPackage ? (
              <>
                <div className="w-full h-40 overflow-hidden rounded-t-lg bg-gray-100">
                  <img
                    src={latestPackage.coverImage || "/placeholder.png"}
                    alt={latestPackage.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="card-body p-4 flex flex-col flex-1">
                  <h5 className="card-title font-semibold text-gray-800 mb-2">
                    {latestPackage.name}
                  </h5>

                 {/* Accordion + Price */}
<div className="border-t border-gray-200 mt-2">
  <button
    className="flex items-center justify-between w-full px-0 py-1 text-sm font-medium text-gray-700 hover:underline"
    onClick={() => setPackageOpen(!packageOpen)}
  >
    <span>{packageOpen ? "Hide Details" : "View Details"}</span>
    <svg
      className={`w-4 h-4 ml-2 transition-transform duration-300 ${
        packageOpen ? "rotate-180" : "rotate-0"
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  </button>

  {packageOpen && (
    <div className="mt-2 text-gray-600 text-sm">
      {/* Full Description */}
   <div
  className="ck-content mb-3 text-gray-600 text-sm"
  dangerouslySetInnerHTML={{ __html: latestPackage.description || "" }}
></div>


      {/* Price */}
      <p className="text-lg font-bold text-gray-800">
        {latestPackage.paymentSettings?.currency || "₹"} {latestPackage.paymentSettings?.price || 0}
      </p>
    </div>
  )}
</div>

                  {/* Action Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/packages/edit/${latestPackage.id}`)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(latestPackage.id)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/package-settings/${latestPackage.id}`)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/package-payment-settings/${latestPackage.id}`)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Payment
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="p-5 text-gray-500">No package created yet.</p>
            )}
          </div>
        </div>
{/* Latest Students */}
<div className="w-full md:w-1/3 px-4">
  <div className="bg-white pt-4 px-3 pb-3 shadow rounded-lg hover:shadow-lg transition duration-200 h-full flex flex-col">
    <h4 className="mb-3 text-lg font-semibold text-gray-800">Latest Students</h4>

    {latestStudents.length > 0 ? (
      <ul className="space-y-1.5 flex-1 overflow-auto">
        {latestStudents.map((s) => (
          <li
            key={s.id}
            className="p-1.5 bg-gray-100 rounded-lg flex justify-between text-sm"
          >
            <span className="truncate">👤 {s.firstName} {s.lastName}</span>
            <span className="italic text-gray-500 truncate">{s.domain || "-"}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 text-sm">No students registered yet.</p>
    )}
  </div>
</div>


{/* Earnings */}
<div className="w-full md:w-1/3 px-3">
  <div className="bg-white p-4 shadow rounded-lg hover:shadow-lg transition duration-200 h-full flex flex-col">
    {/* Header at the top with smaller margin */}
    <h4 className="mb-1 text-lg font-semibold text-gray-800">Earnings</h4>

    {/* Data below header with small gap */}
    <div className="text-gray-700 text-sm space-y-1 mt-2">
      <p className="flex justify-between">
        <span>📆 {earnings.currentMonthName}</span>
        <span className="font-bold text-green-600">₹{earnings.currentMonth}</span>
      </p>
      <p className="flex justify-between">
        <span>📅 {earnings.previousMonthName}</span>
        <span className="font-bold text-blue-600">₹{earnings.previousMonth}</span>
      </p>
      <p className="flex justify-between">
        <span>👥 Total Students</span>
        <span className="font-bold text-purple-600">{earnings.totalStudents}</span>
      </p>
    </div>
  </div>
</div>
    </div>
    </div>
  );
}