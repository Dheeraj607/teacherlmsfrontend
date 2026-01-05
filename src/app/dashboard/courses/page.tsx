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
  <div className="font-sans p-6">
    {/* Header */}
    <h3 className="mb-4">Table Overview</h3>

    {/* Grid */}
    <div className="row gx-5">
      {filteredCourses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        filteredCourses.map((course) => (
          <div key={course.id} className="col-md-5 mb-4">
            <div className="card coursecard">
              {/* Thumbnail */}
              <img
                src={course.thumbnailUrl || "/images/placeholder-course.jpg"}
                className="card-img-top"
                alt={course.title}
              />

              {/* Card Body */}
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>

              {/* Date & Status Row */}
<div className="row mb-3 align-items-center">
  {/* Start Date */}
  <div className="col-7 d-flex align-items-center">
    <span className="me-2">
      <i className="bi bi-calendar3 text-warning"></i>
    </span>
    <span>
      Start Date:{" "}
      {course.startDate
        ? new Date(course.startDate).toLocaleDateString()
        : "N/A"}
    </span>
  </div>

  {/* Status */}
  <div className="col text-end d-flex align-items-center justify-content-end">
    {/* Dot */}
    <span className="me-2">
      <i
        className={`bi bi-circle-fill ${
          isCourseValid(course.startDate)
            ? "text-success"
            : "text-danger"
        }`}
      ></i>
    </span>

    {/* Text */}
    <span className="text-dark">
      Status:{" "}
      <span
        className={
          isCourseValid(course.startDate)
            ? "text-success fw-semibold"
            : "text-danger fw-semibold"
        }
      >
        {isCourseValid(course.startDate) ? "Active" : "Expired"}
      </span>
    </span>
  </div>
</div>


                {/* Package Card */}
          {course.packages && course.packages.length > 0 && (
  <div className="card coursepackagecard mb-3">
    <div className="card-body">
      <h6>Package</h6>
      <ul className="list-disc list-inside">
        {course.packages.map((pkg) => (
          <li key={pkg.id}>{pkg.name}</li>
        ))}
      </ul>
    </div>
  </div>
)}


              {/* Description */}
<p className="card-text line-clamp-3">
  {course.description
    ? course.description.replace(/<[^>]*>/g, "") // removes all HTML tags
    : "No description available."}
</p>


                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/courses/edit/${course.id}`)
                    }
                    className="btn btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/courses/sections?courseId=${course.id}`)
                    }
                    className="btn btn-secondary"
                  >
                    Sections
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn btn-secondary"
                  >
                    Delete
                  </button>
                  <button
                    className={`btn btn-primary ${
                      course.publish ? "disabled" : ""
                    }`}
                  >
                    {course.publish ? "Published" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
    }
