"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [packageOpen, setPackageOpen] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      const normalized: Course[] = (res.data || []).map((c: any) => ({
        ...c,
        thumbnailUrl: c.thumbnail_url || c.thumbnailUrl,
        startDate: c.start_date || c.startDate,
        packages: [],
      }));

      // Fetch packages for each course
      const coursesWithPackages = await Promise.all(
        normalized.map(async (course: Course) => {
          const pkgRes = await api.get(`/courses/${course.id}/packages`);
          return { ...course, packages: pkgRes.data || [] };
        })
      );

      setCourses(coursesWithPackages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const isCourseValid = (startDate?: string) => {
    if (!startDate) return false;
    return new Date(startDate) >= new Date();
  };

  const getCourseStatus = (startDate?: string) => {
  if (!startDate) return "Not Started";

  const today = new Date();
  const courseDate = new Date(startDate);

  return courseDate <= today ? "Active" : "Not Started";
};

const getStatusClass = (startDate?: string) => {
  const status = getCourseStatus(startDate);
  return status === "Active" ? "text-green-600" : "text-yellow-600";
};


  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-semibold">Courses</h3>
        <button
          onClick={() => router.push("/dashboard/courses/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">No courses found.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="card border rounded-lg shadow-md flex flex-col overflow-hidden h-full"
            >
              {/* Image */}
              <div className="w-full h-40 bg-gray-100 overflow-hidden">
                <img
                  src={course.thumbnailUrl || "/images/placeholder-course.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                {/* Title */}
                <h5 className="text-lg font-semibold mb-2">{course.title}</h5>

                {/* Date & Status */}
              <div className="flex justify-between items-center mb-2 text-sm">
  <span>
    Start Date:{" "}
    {course.startDate
      ? new Date(course.startDate).toLocaleDateString()
      : "N/A"}
  </span>
  <span className={`font-semibold ${getStatusClass(course.startDate)}`}>
    {getCourseStatus(course.startDate)}
  </span>
</div>


         {/* View Details Dropdown */}
<div
  onClick={() =>
    setPackageOpen((prev) => ({
      ...prev,
      [course.id]: !prev[course.id],
    }))
  }
  className="flex items-center justify-between cursor-pointer px-3 py-1 mb-4  rounded-lg  transition select-none"
>
  <span className="text-sm font-medium text-gray-700">
    {packageOpen[course.id] ? "Hide Details" : "View Details"}
  </span>
  <svg
    className={`w-4 h-4 ml-2 transition-transform duration-300 ${
      packageOpen[course.id] ? "rotate-180" : "rotate-0"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
</div>

{packageOpen[course.id] && (
  <div className="mb-2 text-gray-700 text-sm">
    <div
      className="ck-content mb-2"
      dangerouslySetInnerHTML={{ __html: course.description || "" }}
    />
{course.packages && course.packages.length > 0 && (
  <div className="mt-2 border-t border-gray-200 pt-2">
    <h6 className="font-medium mb-2 text-gray-700">Packages:</h6>
    <div className="flex flex-wrap gap-2">
      {course.packages.map((pkg) => (
        <span
          key={pkg.id}
          className="px-3 py-1 bg-blue-50 text-black-300 rounded-md text-sm font-medium"
        >
          {pkg.name}
        </span>
      ))}
    </div>
  </div>
)}

  </div>
)}


                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/courses/edit/${course.id}`)
                    }
                    className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/courses/sections?courseId=${course.id}`)
                    }
                    className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
                  >
                    Sections
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
                  >
                    Delete
                  </button>
                  <button
  className={`px-3 py-2 rounded-lg text-sm ${
    course.publish || (course.startDate && new Date(course.startDate) <= new Date())
      ? "bg-green-100 text-green-800 cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
  disabled={!!course.publish || !!(course.startDate && new Date(course.startDate) <= new Date())}

  onClick={async () => {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      await api.put(`/courses/${course.id}`, {
        publish: true,
        startDate: today,
      });

      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, publish: true, startDate: today } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to publish the course");
    }
  }}
>
  {course.publish || (course.startDate && new Date(course.startDate) <= new Date())
    ? "Published"
    : "Publish"}
</button>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}





//     "use client";

//     import { useEffect, useState } from "react";
//     import { useRouter } from "next/navigation";
//     import { LayoutList } from "lucide-react";
//     import { Button } from "@/components/ui/button";
//     import { cn } from "@/lib/utils";
//     import api from "@/services/api";

//     interface Package {
//       id: number;
//       name: string;
//     }

//     interface Course {
//       id: number;
//       title: string;
//       description: string;
//       thumbnailUrl?: string;
//       startDate?: string;
//       publish: boolean;
//       category?: { name?: string };
//       packages?: Package[];
//     }

//     export default function CourseListPage() {
//       const router = useRouter();
//       const [courses, setCourses] = useState<Course[]>([]);
//       const [loading, setLoading] = useState(true);
//       const [packagesList, setPackagesList] = useState<Package[]>([]);
//       const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");



//       useEffect(() => {
//         fetchCourses();
//         fetchAllPackages();
//       }, []);

//       const fetchPackagesForCourse = async (courseId: number) => {
//         try {
//           const res = await api.get(`/courses/${courseId}/packages`);
//           return res.data || [];
//         } catch (err) {
//           console.error(`Error fetching packages for course ${courseId}`, err);
//           return [];
//         }
//       };

//       const fetchCourses = async () => {
//         try {
//           setLoading(true);
//           const response = await api.get("/courses");
//           const normalized: Course[] = (response.data || []).map((c: any) => ({
//             ...c,
//             thumbnailUrl: c.thumbnail_url || c.thumbnailUrl,
//             startDate: c.start_date || c.startDate,
//             category: c.category || { name: c.category_name },
//             packages: [],
//           }));

//           const coursesWithPackages: Course[] = await Promise.all(
//             normalized.map(async (course: Course) => {
//               const packages = await fetchPackagesForCourse(course.id);
//               return { ...course, packages };
//             })
//           );

//           setCourses(coursesWithPackages);
//         } catch (error) {
//           console.error("Error fetching courses:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       const fetchAllPackages = async () => {
//         try {
//           const res = await api.get("/packages");
//           setPackagesList(res.data || []);
//         } catch (err) {
//           console.error("Error fetching packages:", err);
//         }
//       };

//       const handleDelete = async (id: number) => {
//         if (!confirm("Are you sure you want to delete this course?")) return;
//         try {
//           await api.delete(`/courses/${id}`);
//           setCourses((prev) => prev.filter((c) => c.id !== id));
//         } catch (error) {
//           console.error("Error deleting course:", error);
//         }
//       };

//       const isCourseValid = (startDate?: string) => {
//         if (!startDate) return false;
//         return new Date(startDate) >= new Date();
//       };

//       // Filter courses based on selected package
//       const filteredCourses =
//         selectedPackageId === ""
//           ? courses
//           : courses.filter((course) =>
//               course.packages?.some((pkg) => pkg.id === selectedPackageId)
//             );

//     return (
//   <div className="font-sans p-6">
//     <button
//   className="btn btn-primary float-end mt-n5 mb-3 me-0"
//   onClick={() => router.push("/dashboard/courses/create")}
// >
//   + Add Course
// </button>
//     {/* Header */}
//     <h3 className="mb-5">Table Overview</h3>






//     {/* Grid */}
//     <div className="row gx-5">
//       {filteredCourses.length === 0 ? (
//         <p className="text-gray-500">No courses found.</p>
//       ) : (
//         filteredCourses.map((course) => (
//           <div key={course.id} className="col-md-5 mb-4">
//             <div className="card coursecard">
//               {/* Thumbnail */}
//               <img
//                 src={course.thumbnailUrl || "/images/placeholder-course.jpg"}
//                 className="card-img-top"
//                 alt={course.title}
//               />

//               {/* Card Body */}
//               <div className="card-body">
//                 <h5 className="card-title">{course.title}</h5>

//               {/* Date & Status Row */}
// <div className="row mb-3 align-items-center">
//   {/* Start Date */}
//   <div className="col-7 d-flex align-items-center">
//     <span className="me-2">
//       <i className="bi bi-calendar3 text-warning"></i>
//     </span>
//     <span>
//       Start Date:{" "}
//       {course.startDate
//         ? new Date(course.startDate).toLocaleDateString()
//         : "N/A"}
//     </span>
//   </div>

//   {/* Status */}
//   <div className="col text-end d-flex align-items-center justify-content-end">
//     {/* Dot */}
//     <span className="me-2">
//       <i
//         className={`bi bi-circle-fill ${
//           isCourseValid(course.startDate)
//             ? "text-success"
//             : "text-danger"
//         }`}
//       ></i>
//     </span>

//     {/* Text */}
//     <span className="text-dark">
//       Status:{" "}
//       <span
//         className={
//           isCourseValid(course.startDate)
//             ? "text-success fw-semibold"
//             : "text-danger fw-semibold"
//         }
//       >
//         {isCourseValid(course.startDate) ? "Active" : "Expired"}
//       </span>
//     </span>
//   </div>
// </div>


//                 {/* Package Card */}
//           {course.packages && course.packages.length > 0 && (
//   <div className="card coursepackagecard mb-3">
//     <div className="card-body">
//       <h6>Package</h6>
//       <ul className="list-disc list-inside">
//         {course.packages.map((pkg) => (
//           <li key={pkg.id}>{pkg.name}</li>
//         ))}
//       </ul>
//     </div>
//   </div>
// )}


//               {/* Description */}
// {/* <p className="card-text line-clamp-3">
//   {course.description
//     ? course.description.replace(/<[^>]*>/g, "") // removes all HTML tags
//     : "No description available."}
// </p> */}
// <div
//   className="ck-content text-gray-700 text-sm line-clamp-3"
//   dangerouslySetInnerHTML={{ __html: course.description || "" }}
// />



//                 {/* Action Buttons */}
//                 <div className="d-flex flex-wrap gap-2">
//                   <button
//                     onClick={() =>
//                       router.push(`/dashboard/courses/edit/${course.id}`)
//                     }
//                     className="btn btn-secondary"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() =>
//                       router.push(`/dashboard/courses/sections?courseId=${course.id}`)
//                     }
//                     className="btn btn-secondary"
//                   >
//                     Sections
//                   </button>
//                   <button
//                     onClick={() => handleDelete(course.id)}
//                     className="btn btn-secondary"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     className={`btn btn-primary ${
//                       course.publish ? "disabled" : ""
//                     }`}
//                   >
//                     {course.publish ? "Published" : "Publish"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   </div>
// );
//     }
