    "use client";

    import { useEffect, useState } from "react";
    import { useRouter } from "next/navigation";
    import { LayoutList } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { cn } from "@/lib/utils";
    import api from "@/services/api";

    interface Package {
      id: number;
      name: string;
    }

    interface Course {
      id: number;
      title: string;
      description: string;
      thumbnailUrl?: string;
      startDate?: string;
      publish: boolean;
      category?: { name?: string };
      packages?: Package[];
    }

    export default function CourseListPage() {
      const router = useRouter();
      const [courses, setCourses] = useState<Course[]>([]);
      const [loading, setLoading] = useState(true);
      const [packagesList, setPackagesList] = useState<Package[]>([]);
      const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");



      useEffect(() => {
        fetchCourses();
        fetchAllPackages();
      }, []);

      const fetchPackagesForCourse = async (courseId: number) => {
        try {
          const res = await api.get(`/courses/${courseId}/packages`);
          return res.data || [];
        } catch (err) {
          console.error(`Error fetching packages for course ${courseId}`, err);
          return [];
        }
      };

      const fetchCourses = async () => {
        try {
          setLoading(true);
          const response = await api.get("/courses");
          const normalized: Course[] = (response.data || []).map((c: any) => ({
            ...c,
            thumbnailUrl: c.thumbnail_url || c.thumbnailUrl,
            startDate: c.start_date || c.startDate,
            category: c.category || { name: c.category_name },
            packages: [],
          }));

          const coursesWithPackages: Course[] = await Promise.all(
            normalized.map(async (course: Course) => {
              const packages = await fetchPackagesForCourse(course.id);
              return { ...course, packages };
            })
          );

          setCourses(coursesWithPackages);
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          setLoading(false);
        }
      };

      const fetchAllPackages = async () => {
        try {
          const res = await api.get("/packages");
          setPackagesList(res.data || []);
        } catch (err) {
          console.error("Error fetching packages:", err);
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
        return new Date(startDate) >= new Date();
      };

      // Filter courses based on selected package
      const filteredCourses =
        selectedPackageId === ""
          ? courses
          : courses.filter((course) =>
              course.packages?.some((pkg) => pkg.id === selectedPackageId)
            );

      return (
        <div className="p-6 font-sans">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Course List</h2>
            <Button
              onClick={() => router.push("/dashboard/courses/create")}
              className="bg-gray-800 text-white rounded-lg hover:bg-gray-900 px-4 py-2"
            >
              ➕ Create Course
            </Button>
          </div>

          {/* Package Filter */}
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="packageFilter" className="text-gray-700 font-medium">
              Filter by Package:
            </label>
            <select
              id="packageFilter"
              className="border border-gray-300 rounded px-3 py-1"
              value={selectedPackageId}
              onChange={(e) =>
                setSelectedPackageId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            >
              <option value="">All Packages</option>
              {packagesList.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <p>Loading courses...</p>
          ) : filteredCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
                >
                  {/* Thumbnail */}
              <div className="relative w-full h-48 bg-gray-100">
      <img
        src={course.thumbnailUrl || "/images/placeholder-course.jpg"}
        alt={course.title}
        className="w-full h-full object-cover"
      />
    </div>


                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">
                      📅 Start Date:{" "}
                      {course.startDate
                        ? new Date(course.startDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          isCourseValid(course.startDate) ? "bg-green-600" : "bg-red-600"
        )}
      />
      Status: {isCourseValid(course.startDate) ? "Valid" : "Expired"}
    </p>


                    {/* Packages */}
                    {course.packages && course.packages.length > 0 && (
                      <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h6 className="text-sm font-semibold text-purple-800 mb-2">
                          Package:
                        </h6>
                        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                          {course.packages.map((pkg) => (
                            <li key={pkg.id} className="hover:text-blue-900 transition-colors">
                              {pkg.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div
                      className="text-sm text-gray-500 line-clamp-3 mb-3"
                      dangerouslySetInnerHTML={{ __html: course.description || "" }}

                    />

                    {/* Actions */}
                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() =>
                            router.push(`/dashboard/courses/edit/${course.id}`)
                          }
                          className="flex items-center justify-center gap-2 px-5 py-2 min-w-[120px] bg-gray-200 text-gray-800 rounded-full text-sm font-medium shadow hover:bg-gray-300 transition"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/courses/sections?courseId=${course.id}`
                            )
                          }
                          className="flex items-center justify-center gap-2 px-4 py-2 min-w-[120px] bg-gray-200 text-gray-800 rounded-full text-sm font-medium shadow hover:bg-gray-300 transition"
                        >
                          <LayoutList className="w-4 h-4" />
                          Sections
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleDelete(course.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 min-w-[120px] bg-gray-200 text-gray-800 rounded-full text-sm font-medium shadow hover:bg-gray-300 transition"
                        >
                          Delete
                        </Button>
                        <Button
                          className={cn(
                            "flex items-center justify-center gap-2 px-5 py-2 min-w-[120px] rounded-full text-sm font-medium shadow transition",
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
