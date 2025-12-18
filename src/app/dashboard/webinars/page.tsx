"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { ChevronDown, ChevronUp, File, Link2 } from "lucide-react";

const BASE_URL = "https://d1ojm6zdv3m37g.cloudfront.net";
interface Package {
  id: number;
  name?: string;
  title?: string;
}

interface WebinarResource {
  id: number;
  resourceName: string;
  resourceType?: string;
  resourceUrl: string;
}

interface Webinar {
  id: number;
  title: string;
  date: string;
  time: string;
  packages?: Package[];
  thumbnail?: string;
  resources?: WebinarResource[];
  meetingLink?: string;
}

export default function WebinarsPage() {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWebinars();
  }, []);

const fetchWebinars = async () => {
  try {
    setLoading(true);
    const res = await api.get("/webinars");

    // API already returns an array
    setWebinars(res.data || []);
  } catch (error) {
    console.error("Error fetching webinars:", error);
  } finally {
    setLoading(false);
  }
};



  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this webinar?")) return;
    try {
      await api.delete(`/webinars/${id}`);
      setWebinars((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Error deleting webinar:", error);
    }
  };

  const getStatus = (dateStr: string) => {
    const today = new Date();
    const webinarDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    webinarDate.setHours(0, 0, 0, 0);

    if (webinarDate > today) return "Upcoming";
    if (webinarDate.getTime() === today.getTime()) return "Today";
    return "Completed";
  };

  const toggleResources = async (webinarId: number) => {
    if (expandedId === webinarId) {
      setExpandedId(null);
      return;
    }

    try {
      const res = await api.get(`/webinar-resources/webinar/${webinarId}`);
      setWebinars((prev) =>
        prev.map((w) =>
          w.id === webinarId ? { ...w, resources: res.data } : w
        )
      );
      setExpandedId(webinarId);
    } catch (error) {
      console.error("Error loading resources:", error);
    }
  };

  return (
    <div className="p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
           Webinar List
        </h2>
        <button
          onClick={() => router.push("/dashboard/webinars/create")}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
        >
          ➕ Create Webinar
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 text-lg">Loading webinars...</p>
      ) : webinars.length === 0 ? (
        <p className="text-gray-500 text-lg">No webinars found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {webinars.map((webinar) => (
            <div
              key={webinar.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              {/* Thumbnail */}
              {webinar.thumbnail && (
                <img
                  src={webinar.thumbnail}
                  alt={webinar.title}
                  className="w-full h-40 object-cover"
                />
              )}
  
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {webinar.title}
                </h3>

                {/* Status */}
                <span
                  className={`text-sm font-medium mb-2 inline-block px-2 py-1 rounded ${
                    getStatus(webinar.date) === "Upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : getStatus(webinar.date) === "Today"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {getStatus(webinar.date)}
                </span>

                {/* Packages */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {webinar.packages && webinar.packages.length > 0 ? (
                    webinar.packages.map((pkg) => (
                      <span
                        key={pkg.id}
                        className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm transform hover:scale-105 transition-all duration-200"
                      >
                        {pkg.name || pkg.title || `Package ${pkg.id}`}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">📦 No packages</span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-1">
                  📅 {webinar.date} | ⏰ {webinar.time}
                </p>
                {/* Meeting Link */}
                {webinar.meetingLink && (
                  <a
                    href={
                      webinar.meetingLink.startsWith("http")
                        ? webinar.meetingLink
                        : `https://${webinar.meetingLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
                  >
                    🔗 Join Meeting
                  </a>
                )}

                {/* Resource Toggle Button */}
                <button
                  onClick={() => toggleResources(webinar.id)}
                  className="mt-3 text-sm font-medium text-gray-800 hover:text-gray-900 flex items-center gap-1 transition"
                >
                  {expandedId === webinar.id ? (
                    <>
                      <ChevronUp size={16} /> Hide Resources
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> View Resources
                    </>
                  )}
                </button>

                {expandedId === webinar.id && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200 max-h-40 overflow-y-auto">
                    {webinar.resources && webinar.resources.length > 0 ? (
                      webinar.resources.map((r) => {
                        const fileUrl = `${BASE_URL}${r.resourceUrl}`;
                        
                        return (
                          <div key={r.id} className="py-1 border-b last:border-none">
                            {r.resourceUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                              <img
                                src={fileUrl}
                                alt={r.resourceName}
                                className="w-full rounded-lg mb-2"
                              />
                            ) : (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                              >
                                <File size={14} />
                                {r.resourceName}
                                <Link2 size={12} className="ml-auto opacity-60" />
                              </a>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-400 text-sm text-center">
                        No resources uploaded. Please manage the resources.
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/webinars/edit/${webinar.id}`)
                    }
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                     Edit
                  </button>
                  <button
                    onClick={() => handleDelete(webinar.id)}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                     Delete
                  </button>
                </div>

                {/* Manage Resource Button */}
                <div className="mt-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/webinars/upload-resource?webinarId=${webinar.id}`
                      )
                    }
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                  >
                     Manage Resources
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
