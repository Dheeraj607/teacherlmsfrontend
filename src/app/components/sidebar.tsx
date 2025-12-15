// "use client";
// import { useRouter } from "next/navigation";

// export default function Sidebar() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/");
//   };

//   return (
    // <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
    //   <h2 className="text-xl font-bold p-4 border-b border-gray-700">
    //     Dashboard
    //   </h2>

//       <nav className="flex-1 p-4 space-y-2">
//         <button
//           onClick={() => router.push("/dashboard/packages")}
//           className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
//         >
//            Packages
//         </button>

//         <button
//           onClick={() => router.push("/dashboard/courses")}
//           className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
//         >
//            Courses
//         </button>

//         <button
//           onClick={() => router.push("/dashboard/webinars")}
//           className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
//         >
//            Webinars
//         </button>

//         {/* NEW MENU: Registered Students */}
//         <button
//           onClick={() => router.push("/dashboard/registered-students")}
//           className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
//         >
//            Registered Students
//         </button>
//       </nav>

//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700"
//         >
//            Logout
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useRouter } from "next/navigation";

// export default function Sidebar() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   return (
//     <div className="sidebar d-flex flex-column">
//       <h4 className="p-3 border-bottom">Dashboard</h4>

//       <a onClick={() => router.push("/dashboard/packages")}>Packages</a>
//       <a onClick={() => router.push("/dashboard/courses")}>Courses</a>
//       <a onClick={() => router.push("/dashboard/webinars")}>Webinars</a>
//       <a onClick={() => router.push("/dashboard/registered-students")}>Registered Students</a>

//       <a onClick={handleLogout} className="mt-auto logout-btn">Logout</a>
//     </div>
//   );
// }


"use client";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all relevant localStorage items
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("student");
    localStorage.removeItem("studentId");
    localStorage.removeItem("domainData");

    // Redirect to login
    router.push("/login");
  };

  return (
    <div className="sidebar d-flex flex-column">
      <h4 className="p-3 border-bottom">Dashboard</h4>

      <a onClick={() => router.push("/dashboard/packages")}>Packages</a>
      <a onClick={() => router.push("/dashboard/courses")}>Courses</a>
      <a onClick={() => router.push("/dashboard/webinars")}>Webinars</a>
      <a onClick={() => router.push("/dashboard/registered-students")}>Registered Students</a>

      <a onClick={handleLogout} className="mt-auto logout-btn">
        Logout
      </a>
    </div>
  );
}
