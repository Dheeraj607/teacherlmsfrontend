"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";

function SidebarLogout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="mt-auto p-3 border-t border-blue-800">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-3 py-2 rounded font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export default function Sidebar({ sidebarOpen = true }: { sidebarOpen?: boolean }) {
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");
  const [teacher, setTeacher] = useState<{ name: string; email: string } | null>(null);

  // Load teacher info from localStorage
  useEffect(() => {
    const loadTeacherInfo = () => {
      const name = localStorage.getItem("teacherName");
      const email = localStorage.getItem("teacherEmail");

      if (name && email) {
        setTeacher({ name, email });
      }
    };

    // Load initially
    loadTeacherInfo();

    // Listen for storage changes (triggered by profile updates)
    const handleStorageChange = () => {
      loadTeacherInfo();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleNavigate = (label: string, path: string) => {
    setActive(label);
    router.push(path);
  };

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("student");
    localStorage.removeItem("studentId");
    localStorage.removeItem("domainData");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("pendingEmail");
    localStorage.removeItem("pendingPhone");

    router.push("/logout-success");


  };

  return (
    <div
      className={`fixed md:relative top-0 left-0 z-50 flex flex-col bg-blue-900 text-white h-screen transition-transform duration-300 min-w-[230px] font-sans ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
    >


      {/* Dynamic Title */}
      <h4 className="p-3 border-b border-blue-800 text-lg font-semibold">
        {active}
      </h4>
      {/* Display teacher info at the top */}
      {teacher && (
        <div className="p-3 border-b border-blue-800 flex items-center gap-3">
          {/* Profile Icon */}
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>

          {/* Teacher Info */}
          <div>
            <p className="font-semibold text-white">{teacher.name}</p>
            <p className="text-sm text-white">{teacher.email}</p>
          </div>
        </div>
      )}


      {/* Sidebar Items */}
      <nav className="flex flex-col flex-grow p-2 space-y-1">
        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Dashboard" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() => handleNavigate("Dashboard", "/dashboard")}
        >
          Dashboard
        </button>


        {/* Inside Sidebar nav */}
        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Profile" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() => handleNavigate("Profile", "/dashboard/profile")}
        >
          Profile
        </button>

        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Packages" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() => handleNavigate("Packages", "/dashboard/packages")}
        >
          Packages
        </button>

        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Courses" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() => handleNavigate("Courses", "/dashboard/courses")}
        >
          Courses
        </button>

        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Webinars" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() => handleNavigate("Webinars", "/dashboard/webinars")}
        >
          Webinars
        </button>

        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Registered Students" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() =>
            handleNavigate(
              "Registered Students",
              "/dashboard/registered-students"
            )
          }
        >
          Registered Students
        </button>

        <button
          className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${active === "Payment Reports" ? "bg-blue-800 font-medium" : ""
            }`}
          onClick={() => handleNavigate("Payment Reports", "/dashboard/payment-reports")}
        >
          Payment Reports
        </button>


        {/* Logout at the bottom */}
        <SidebarLogout onLogout={handleLogout} />
      </nav>
    </div>
  );
}


// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { LogOut } from "lucide-react";

// function SidebarLogout({ onLogout }: { onLogout: () => void }) {
//   return (
//     <div className="mt-auto p-3 border-t border-blue-800">
//       <button
//         onClick={onLogout}
//         className="w-full flex items-center gap-2 px-3 py-2 rounded font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
//       >
//         <LogOut size={18} />
//         Logout
//       </button>
//     </div>
//   );
// }


// export default function Sidebar({ sidebarOpen = true }: { sidebarOpen?: boolean }) {
//   const router = useRouter();
//   const [active, setActive] = useState("Dashboard");

//   const handleNavigate = (label: string, path: string) => {
//     setActive(label);
//     router.push(path);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("student");
//     localStorage.removeItem("studentId");
//     localStorage.removeItem("domainData");
//       localStorage.removeItem("teacherId");
//   localStorage.removeItem("teacherName");
//   localStorage.removeItem("teacherEmail");

//     router.push("/login");
//   };

//   return (
//     <div
//       className={`fixed md:relative top-0 left-0 z-50 flex flex-col bg-blue-900 text-white h-screen transition-transform duration-300 min-w-[230px] font-sans ${
//         sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//       }`}
//     >
//       {/* Dynamic Title */}
//       <h4 className="p-3 border-b border-blue-800 text-lg font-semibold">
//         {active}
//       </h4>

//       {/* Sidebar Items */}
//       <nav className="flex flex-col flex-grow p-2 space-y-1">
//         <button
//           className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${
//             active === "Dashboard" ? "bg-blue-800 font-medium" : ""
//           }`}
//           onClick={() => handleNavigate("Dashboard", "/dashboard")}
//         >
//           Dashboard
//         </button>

//         <button
//           className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${
//             active === "Packages" ? "bg-blue-800 font-medium" : ""
//           }`}
//           onClick={() => handleNavigate("Packages", "/dashboard/packages")}
//         >
//           Packages
//         </button>

//         <button
//           className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${
//             active === "Courses" ? "bg-blue-800 font-medium" : ""
//           }`}
//           onClick={() => handleNavigate("Courses", "/dashboard/courses")}
//         >
//           Courses
//         </button>

//         <button
//           className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${
//             active === "Webinars" ? "bg-blue-800 font-medium" : ""
//           }`}
//           onClick={() => handleNavigate("Webinars", "/dashboard/webinars")}
//         >
//           Webinars
//         </button>

//         <button
//           className={`text-left px-3 py-2 rounded-md hover:bg-blue-800 transition ${
//             active === "Registered Students" ? "bg-blue-800 font-medium" : ""
//           }`}
//           onClick={() =>
//             handleNavigate(
//               "Registered Students",
//               "/dashboard/registered-students"
//             )
//           }
//         >
//           Registered Students
//         </button>

//         {/* Logout at the bottom */}
//         <SidebarLogout onLogout={handleLogout} />
//       </nav>
//     </div>
//   );
// }
