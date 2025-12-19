"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react";  // Add Suspense
import { useSearchParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";

interface Level {
  id: number;
  level_name: string;
}

// Extract the inner logic into a separate client component
function SelectLevelContent() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();  // Now safe inside Suspense

  useEffect(() => {
    const cid = searchParams.get("courseId");
    setCourseId(cid ? Number(cid) : null);
  }, [searchParams]);

useEffect(() => {
  const fetchLevels = async () => {  // Fixed: removed the extra "=" 
    try {
      const res = await fetch(`${API_URL}/course-levels`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLevels(data);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  fetchLevels();
}, []);

  const handleCheckboxChange = (levelId: number) => {
    setSelected((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId]
    );
  };

  const handleNext = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }

    try {
      await fetch(`${API_URL}/course-level-mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selected.map((levelId) => ({
            course_id: courseId,
            course_level_id: levelId,
          }))
        ),
      });

      router.push(`/dashboard/courses/select-categories?courseId=${courseId}`);
    } catch (error) {
      console.error("Error saving levels:", error);
    }
  };

  if (courseId === null) {
    return <p className="text-center mt-10">Loading course info...</p>;
  }

  return (
    <div className="min-h-screen bg-purple-50 p-8 font-sans">
      <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">
          Select Course Levels
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {levels.map((level) => (
            <label
              key={level.id}
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
                ${
                  selected.includes(level.id)
                    ? "bg-purple-100 border-2 border-purple-500 shadow-md"
                    : "bg-white border border-purple-300 hover:shadow hover:border-purple-400"
                }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(level.id)}
                onChange={() => handleCheckboxChange(level.id)}
                className="w-5 h-5 text-purple-600 rounded"
              />
              <span className="text-lg font-medium text-purple-700 ml-2">
                {level.level_name}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleNext}
            className="btn btn-primary"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelectLevelPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <SelectLevelContent />
    </Suspense>
  );
}


// "use client";
// export const dynamic = 'force-dynamic';

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

//  const API_URL =
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";


// interface Level {
//   id: number;
//   level_name: string;
// }

// export default function SelectLevelPage() {
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [selected, setSelected] = useState<number[]>([]);
//   const [courseId, setCourseId] = useState<number | null>(null);
//   const router = useRouter();

//   // Get courseId from URL params on client side
//   useEffect(() => {
//     const params = useSearchParams();
//     const cid = params?.get("courseId");
//     setCourseId(cid ? Number(cid) : null);
//   }, []);

//   useEffect(() => {
//     const fetchLevels = async () => {
//       try {
//         const res = await fetch(`${API_URL}/course-levels`);
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setLevels(data);
//         } else {
//           console.error("Unexpected API response:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching levels:", error);
//       }
//     };

//     fetchLevels();
//   }, []);

//   const handleCheckboxChange = (levelId: number) => {
//     setSelected((prev) =>
//       prev.includes(levelId)
//         ? prev.filter((id) => id !== levelId)
//         : [...prev, levelId]
//     );
//   };

//   const handleNext = async () => {
//     if (!courseId) {
//       alert("Course ID is missing.");
//       return;
//     }

//     try {
//       await fetch(`${API_URL}/course-level-mappings`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           selected.map((levelId) => ({
//             course_id: courseId,
//             course_level_id: levelId,
//           }))
//         ),
//       });

//       router.push(`/dashboard/courses/select-categories?courseId=${courseId}`);
//     } catch (error) {
//       console.error("Error saving levels:", error);
//     }
//   };

//   if (courseId === null) return <p className="text-center mt-10">Loading course info...</p>;

//   return (
//     <div className="min-h-screen bg-purple-50 p-8 font-sans">
//       <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-purple-800 mb-6">
//           Select Course Levels
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {levels.map((level) => (
//             <label
//               key={level.id}
//               className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
//                 ${
//                   selected.includes(level.id)
//                     ? "bg-purple-100 border-2 border-purple-500 shadow-md"
//                     : "bg-white border border-purple-300 hover:shadow hover:border-purple-400"
//                 }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={selected.includes(level.id)}
//                 onChange={() => handleCheckboxChange(level.id)}
//                 className="w-5 h-5 text-purple-600 rounded"
//               />
//               <span className="text-lg font-medium text-purple-700 ml-2">
//                 {level.level_name}
//               </span>
//             </label>
//           ))}
//         </div>

//         <div className="flex justify-end mt-4">
//           <button
//             onClick={handleNext}
//             className="btn btn-primary"
//           >
//             Save & Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// export const dynamic = 'force-dynamic';

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// interface Level {
//   id: number;
//   level_name: string;
// }

// export default function SelectLevelPage() {
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [selected, setSelected] = useState<number[]>([]);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const courseId = Number(searchParams?.get("courseId"));

//   useEffect(() => {
//     const fetchLevels = async () => {
//       try {
//         const res = await fetch("http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/course-levels");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setLevels(data);
//         } else {
//           console.error("Unexpected API response:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching levels:", error);
//       }
//     };

//     fetchLevels();
//   }, []);

//   const handleCheckboxChange = (levelId: number) => {
//     setSelected((prev) =>
//       prev.includes(levelId)
//         ? prev.filter((id) => id !== levelId)
//         : [...prev, levelId]
//     );
//   };

//   const handleNext = async () => {
//     if (!courseId) {
//       alert("Course ID is missing.");
//       return;
//     }

//     try {
//       await fetch("http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/course-level-mappings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           selected.map((levelId) => ({
//             course_id: courseId,
//             course_level_id: levelId,
//           }))
//         ),
//       });

//       router.push(`/dashboard/courses/select-categories?courseId=${courseId}`);
//     } catch (error) {
//       console.error("Error saving levels:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-purple-50 p-8 font-sans">
//       <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-purple-800 mb-6">
//           Select Course Levels
//         </h1>

// <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//   {levels.map((level) => (
//     <label
//       key={level.id}
//       className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200
//         ${
//           selected.includes(level.id)
//             ? "bg-purple-100 border-2 border-purple-500 shadow-md"
//             : "bg-white border border-purple-300 hover:shadow hover:border-purple-400"
//         }`}
//     >
//       <input
//         type="checkbox"
//         checked={selected.includes(level.id)}
//         onChange={() => handleCheckboxChange(level.id)}
//         className="w-5 h-5 text-purple-600 rounded"
//       />
//       <span className="text-lg font-medium text-purple-700 ml-2">
//         {level.level_name}
//       </span>
//     </label>
//   ))}
// </div>


//  <div className="flex justify-end mt-4">
//   <button
//     onClick={handleNext}
//     className="btn btn-primary"
//   >
//     Save & Next
//   </button>
// </div>

//       </div>
//     </div>
//   );
// }
