"use client";
import { LogOut } from "lucide-react";

function SidebarLogout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="mt-auto p-3 border-top">
      <button
        onClick={onLogout}
        className="w-100 d-flex align-items-center gap-2 px-3 py-2 rounded fw-semibold text-danger"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}



import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");

  const handleNavigate = (label: string, path: string) => {
    setActive(label);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("student");
    localStorage.removeItem("studentId");
    localStorage.removeItem("domainData");

    router.push("/login");
  };

  return (
    <div className="sidebar d-flex flex-column">
      {/* Dynamic Title */}
      <h4 className="p-3 border-bottom">{active}</h4>

      {/* Sidebar Items */}
      <a
        className={active === "Dashboard" ? "active" : ""}
        onClick={() => handleNavigate("Dashboard", "/dashboard")}
      >
        Dashboard
      </a>

      <a
        className={active === "Packages" ? "active" : ""}
        onClick={() => handleNavigate("Packages", "/dashboard/packages")}
      >
        Packages
      </a>

      <a
        className={active === "Courses" ? "active" : ""}
        onClick={() => handleNavigate("Courses", "/dashboard/courses")}
      >
        Courses
      </a>

      <a
        className={active === "Webinars" ? "active" : ""}
        onClick={() => handleNavigate("Webinars", "/dashboard/webinars")}
      >
        Webinars
      </a>

      <a
        className={active === "Registered Students" ? "active" : ""}
        onClick={() =>
          handleNavigate(
            "Registered Students",
            "/dashboard/registered-students"
          )
        }
      >
        Registered Students
      </a>

     <SidebarLogout onLogout={handleLogout} />

    </div>
  );
}




// "use client";
// import { useRouter } from "next/navigation";

// export default function Sidebar() {
//   const router = useRouter();

//   const handleLogout = () => {
//     // Clear all relevant localStorage items
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("student");
//     localStorage.removeItem("studentId");
//     localStorage.removeItem("domainData");

//     // Redirect to login
//     router.push("/login");
//   };

//   return (
//     <div className="sidebar d-flex flex-column">
//       <h4 className="p-3 border-bottom">Dashboard</h4>

//       <a onClick={() => router.push("/dashboard/packages")}>Packages</a>
//       <a onClick={() => router.push("/dashboard/courses")}>Courses</a>
//       <a onClick={() => router.push("/dashboard/webinars")}>Webinars</a>
//       <a onClick={() => router.push("/dashboard/registered-students")}>Registered Students</a>

//       <a onClick={handleLogout} className="mt-auto logout-btn">
//         Logout
//       </a>
//     </div>
//   );
// }
