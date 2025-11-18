"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/services/api";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  startDate?: string;
  publish: boolean;
  category?: { name?: string };
}

export default function CourseListPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      const normalized = (response.data || []).map((c: any) => ({
        ...c,
        thumbnailUrl: c.thumbnail_url || c.thumbnailUrl,
        startDate: c.start_date || c.startDate,
        category: c.category || { name: c.category_name },
      }));
      setCourses(normalized);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const isCourseValid = (startDate?: string) => {
    if (!startDate) return false;
    return new Date(startDate) >= new Date(); // valid if start date is today or future
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          🎓 Course List
        </h2>
        <Button
          onClick={() => router.push("/dashboard/courses/create")}
          className="bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition px-4 py-2"
        >
          ➕ Create Course
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 text-lg">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500 text-lg">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              {/* ✅ Thumbnail Preview */}
              <div className="relative w-full h-48 bg-gray-100">
                <img
                  src={
                    course.thumbnailUrl
                      ? course.thumbnailUrl.startsWith("http")
                        ? course.thumbnailUrl
                        : `${API_BASE_URL}/${course.thumbnailUrl.replace(/^\//, "")}`
                      : "/images/placeholder-course.jpg"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder-course.jpg";
                  }}
                />
              </div>

              {/* ✅ Course Info */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mb-1">
                  📅 Start Date:{" "}
                  {course.startDate
                    ? new Date(course.startDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p
                  className={cn(
                    "text-sm font-medium mb-2",
                    isCourseValid(course.startDate)
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  Status: {isCourseValid(course.startDate) ? "Valid" : "Expired"}
                </p>

                <div
                  className="text-sm text-gray-500 line-clamp-3 mb-3"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />

                {/* ✅ Action Buttons */}
                <div className="mt-auto flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-wrap gap-2">
                    {/* Edit Button */}
                    <Button
                      onClick={() =>
                        router.push(`/dashboard/courses/edit/${course.id}`)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium shadow hover:bg-gray-300 transition"
                    >
                      ✏️ Edit
                    </Button>

                    {/* Sections Button */}
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/courses/sections?courseId=${course.id}`
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium shadow hover:bg-gray-300 transition"
                    >
                      <LayoutList className="w-4 h-4" />
                      Sections
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Delete Button */}
                    <Button
                      onClick={() => handleDelete(course.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium shadow hover:bg-gray-300 transition"
                    >
                      🗑️ Delete
                    </Button>

                    {/* Publish/Status Button */}
                    <Button
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow transition",
                        course.publish
                          ? "bg-gray-800 text-white hover:bg-gray-900"
                          : "bg-gray-400 text-gray-900 hover:bg-gray-500"
                      )}
                    >
                      {course.publish ? "Published" : "Publish"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
