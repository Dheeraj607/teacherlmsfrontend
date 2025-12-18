// "use client";
// export const dynamic = 'force-dynamic';

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";




// interface Category {
//   id: number;
//   name: string;
// }

// export default function SelectCategoriesPage() {
//   const router = useRouter();
//     const API_URL =
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";

//   const [courseId, setCourseId] = useState<number | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selected, setSelected] = useState<number[]>([]);

//   // Get courseId on client
//   useEffect(() => {
//     const params = useSearchParams();
//     const cid = params?.get("courseId");
//     setCourseId(cid ? Number(cid) : null);
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(`${API_URL}/category`);
//         const data = await res.json();
//         if (Array.isArray(data)) setCategories(data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const toggleCategory = (categoryId: number) => {
//     setSelected(prev =>
//       prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
//     );
//   };

//   const saveCategories = async () => {
//     if (!courseId) {
//       alert("Course ID is missing.");
//       return false;
//     }

//     try {
//       await fetch(`${API_URL}/course-category-mappings`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           selected.map(categoryId => ({ courseId, categoryId }))
//         ),
//       });

//       console.log("Selected categories saved:", selected);
//       return true;
//     } catch (error) {
//       console.error("Error saving categories:", error);
//       return false;
//     }
//   };

//   const handleSave = async () => {
//     const saved = await saveCategories();
//     if (saved) router.push("/dashboard/courses");
//   };

//   const handleSaveAndNext = async () => {
//     const saved = await saveCategories();
//     if (saved) router.push(`/dashboard/courses/sections?courseId=${courseId}`);
//   };

//   if (courseId === null) return <p className="text-center mt-10">Loading course info...</p>;

//   return (
//     <div className="min-h-screen bg-purple-50 p-8 flex justify-start items-start font-sans">
//       <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
//         <h1 className="text-3xl font-bold text-purple-800 text-left mb-6">
//           Select Course Categories
//         </h1>

//         <div className="flex flex-col gap-4">
//           {categories.map(category => (
//             <div
//               key={category.id}
//               className={`flex items-center gap-3 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200
//                 ${selected.includes(category.id)
//                   ? "bg-purple-100 border-2 border-green-500"
//                   : "bg-white border border-purple-300 hover:shadow hover:border-purple-400"
//                 }`}
//               onClick={() => toggleCategory(category.id)}
//             >
//               <span
//                 className={`w-6 h-6 flex items-center justify-center rounded-full border-2 text-white font-bold ${
//                   selected.includes(category.id)
//                     ? "bg-green-600 border-green-600"
//                     : "border-gray-400"
//                 }`}
//               >
//                 {selected.includes(category.id) ? "☑" : ""}
//               </span>
//               <span className="text-lg font-medium text-purple-700">
//                 {category.name}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <button onClick={handleSave} className="btn btn-primary">Save</button>
//           <button onClick={handleSaveAndNext} className="btn btn-primary">Save & Go to Sections</button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
export const dynamic = 'force-dynamic';


import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

export default function SelectCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

    const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";
  const courseId = Number(searchParams?.get("courseId"));

  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/category`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const saveCategories = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return false;
    }

    try {
      await fetch(`${API_URL}/course-category-mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
  selected.map((categoryId) => ({
    courseId: courseId,
    categoryId: categoryId,
  }))
)
,
      });

      console.log("Selected categories saved:", selected);
      return true;
    } catch (error) {
      console.error("Error saving categories:", error);
      return false;
    }
  };

  const handleSave = async () => {
    const saved = await saveCategories();
    if (saved) {
      router.push("/dashboard/courses");
    }
  };

  const handleSaveAndNext = async () => {
    const saved = await saveCategories();
    if (saved) {
      router.push(`/dashboard/courses/sections?courseId=${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8 flex justify-start items-start font-sans">
      {/* Left-aligned form */}
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-purple-800 text-left mb-6">
          Select Course Categories
        </h1>

        {/* Categories list */}
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center gap-3 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200
                ${
                  selected.includes(category.id)
                    ? "bg-purple-100 border-2 border-green-500"
                    : "bg-white border border-purple-300 hover:shadow hover:border-purple-400"
                }`}
              onClick={() => toggleCategory(category.id)}
            >
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 text-white font-bold ${
                  selected.includes(category.id)
                    ? "bg-green-600 border-green-600"
                    : "border-gray-400"
                }`}
              >
                {selected.includes(category.id) ? "☑" : ""}
              </span>
              <span className="text-lg font-medium text-purple-700">
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons at bottom-right */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            Save
          </button>

          <button
            onClick={handleSaveAndNext}
            className="btn btn-primary"
          >
            Save & Go to Sections
          </button>
        </div>
      </div>
    </div>
  );
}




// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// interface Category {
//   id: number;
//   name: string;
// }

// export default function SelectCategoriesPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const courseId = Number(searchParams?.get("courseId"));

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selected, setSelected] = useState<number[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/category");
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setCategories(data);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const toggleCategory = (categoryId: number) => {
//     setSelected((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   const saveCategories = async () => {
//     if (!courseId) {
//       alert("Course ID is missing.");
//       return false;
//     }

//     try {
//       await fetch("http://localhost:3000/course-category-mappings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(
//           selected.map((categoryId) => ({
//             course_id: courseId,
//             category_id: categoryId,
//           }))
//         ),
//       });

//       console.log("Selected categories saved:", selected);
//       return true;
//     } catch (error) {
//       console.error("Error saving categories:", error);
//       return false;
//     }
//   };

//   const handleSave = async () => {
//     const saved = await saveCategories();
//     if (saved) {
//       router.push("/dashboard/courses"); // go to course list
//     }
//   };

//   const handleSaveAndNext = async () => {
//     const saved = await saveCategories();
//     if (saved) {
//       router.push(`/dashboard/courses/sections?courseId=${courseId}`); // go to section list
//     }
//   };

//   return (
//     <div className="min-h-screen bg-purple-50 p-8 flex justify-center items-center">
//       <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
//         <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">
//           Select Course Categories
//         </h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
//           {categories.map((category) => (
//             <label
//               key={category.id}
//               className={`flex items-center gap-3 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
//                 selected.includes(category.id)
//                   ? "bg-purple-100 border border-green-500"
//                   : "bg-white border border-purple-300"
//               }`}
//             >
//               <input
//                 type="checkbox"
//                 checked={selected.includes(category.id)}
//                 onChange={() => toggleCategory(category.id)}
//                 className="w-5 h-5 text-green-600"
//               />
//               <span className="text-lg font-medium text-purple-700">
//                 {category.name}
//               </span>
//             </label>
//           ))}
//         </div>

//         <div className="flex justify-center gap-6">
//           <button
//             onClick={handleSave}
//             className="px-6 py-3 bg-purple-500 text-white rounded-lg text-md font-medium hover:bg-purple-700 transition duration-200"
//           >
//             Save
//           </button>

//           <button
//             onClick={handleSaveAndNext}
//             className="px-6 py-3 bg-purple-500 text-white rounded-lg text-md font-medium hover:bg-purple-700 transition duration-200"
//           >
//             Save & Go to Sections
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
