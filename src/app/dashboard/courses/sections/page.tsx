// "use client";
// export const dynamic = 'force-dynamic';

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { PencilSquareIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
// import { BookOpenText } from 'lucide-react';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// if (!API_BASE_URL) {
//   throw new Error("NEXT_PUBLIC_API_URL is not defined");
// }


// interface Section {
//   id: number;
//   title: string;
//   description: string;
//   order_index: number;
// }

// export default function SectionListPage() {
//   const router = useRouter();

//   const [courseId, setCourseId] = useState<number | null>(null);
//   const [sections, setSections] = useState<Section[]>([]);

//   // Get courseId from URL on client
//   useEffect(() => {
//     const params = useSearchParams();
//     const cid = params?.get("courseId");
//     setCourseId(cid ? Number(cid) : null);
//   }, []);

//   // Fetch sections when courseId is available
//   useEffect(() => {
//     if (courseId === null) return;

//     const fetchSections = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/sections/getByCourseId/${courseId}`);
//         const data = await res.json();
//         setSections(data.sort((a: Section, b: Section) => a.order_index - b.order_index));
//       } catch (err) {
//         console.error("Error fetching sections:", err);
//       }
//     };

//     fetchSections();
//   }, [courseId]);

//   const goToCreate = () => {
//     if (courseId !== null) router.push(`/dashboard/courses/sections/create?courseId=${courseId}`);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this section?")) return;
//     try {
//       await fetch(`${API_BASE_URL}/sections/${id}`, { method: "DELETE" });
//       setSections(prev => prev.filter(s => s.id !== id));
//     } catch (err) {
//       console.error("Error deleting section:", err);
//     }
//   };

//   const changeOrder = async (id: number, direction: 'up' | 'down') => {
//     try {
//       await fetch(`${API_BASE_URL}/sections/${id}/change-order`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ direction }),
//       });

//       if (courseId !== null) {
//         const refreshed = await fetch(`${API_BASE_URL}/sections/getByCourseId/${courseId}`);
//         const updated = await refreshed.json();
//         setSections(updated.sort((a: Section, b: Section) => a.order_index - b.order_index));
//       }
//     } catch (err) {
//       console.error("Error changing order:", err);
//     }
//   };

//   if (courseId === null) return <p className="text-center mt-10">Loading course info...</p>;

//   return (
//     <div className="min-h-screen bg-purple-50 p-8 flex justify-start items-start font-sans">
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold text-purple-800">Sections</h1>
//           <button
//             onClick={goToCreate}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
//           >
//             + Create Section
//           </button>
//         </div>

//         {sections.length === 0 ? (
//           <p className="text-purple-500">No sections available.</p>
//         ) : (
//           <ul className="space-y-4">
//             {sections.map((section, index) => (
//               <li
//                 key={section.id}
//                 className="p-4 bg-white border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start"
//               >
//                 <div className="flex-1 pr-4">
//                   <h2 className="text-lg font-semibold text-purple-800">{section.title}</h2>
//                   <div
//                     className="text-purple-700 mb-2"
//                     dangerouslySetInnerHTML={{ __html: section.description || "No description available." }}
//                   ></div>
//                   <p className="text-sm text-purple-500">Order: {section.order_index}</p>
//                 </div>

//                 <div className="flex flex-col gap-2 items-end">
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() => changeOrder(section.id, 'up')}
//                       disabled={index === 0}
//                       className={`p-2 rounded-lg ${index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-100 transition duration-150'}`}
//                     >
//                       <ArrowUpIcon className="h-5 w-5 text-purple-700" />
//                     </button>
//                     <button
//                       onClick={() => changeOrder(section.id, 'down')}
//                       disabled={index === sections.length - 1}
//                       className={`p-2 rounded-lg ${index === sections.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-100 transition duration-150'}`}
//                     >
//                       <ArrowDownIcon className="h-5 w-5 text-purple-700" />
//                     </button>
//                   </div>

//                   <div className="flex gap-1">
//                     <button
//                       onClick={() =>
//                         router.push(`/dashboard/courses/sections/${section.id}/edit?courseId=${courseId}`)
//                       }
//                       className="bg-white text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition duration-150"
//                     >
//                       <PencilSquareIcon className="h-5 w-5" />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(section.id)}
//                       className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-150"
//                     >
//                       <TrashIcon className="h-5 w-5" />
//                     </button>

//                     <button
//                       onClick={() =>
//                         router.push(`/dashboard/courses/sections/${section.id}/chapters?courseId=${courseId}`)
//                       }
//                       className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1.5 rounded-md hover:bg-purple-200 transition duration-150 text-sm font-medium"
//                     >
//                       <BookOpenText className="w-4 h-4" />
//                       Chapters
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }






"use client";
export const dynamic = 'force-dynamic';


import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { BookOpenText } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_API_URL is missing");
}


interface Section {
  id: number;
  title: string;
  description: string;
  order_index: number;
}

export default function SectionListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = Number(searchParams?.get("courseId"));

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!courseId) return;

    const fetchSections = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sections/getByCourseId/${courseId}`);
        const data = await res.json();
        setSections(data.sort((a: Section, b: Section) => a.order_index - b.order_index));
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };

    fetchSections();
  }, [courseId]);

  const goToCreate = () => {
    router.push(`/dashboard/courses/sections/create?courseId=${courseId}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await fetch(`${API_BASE_URL}/sections/${id}`, { method: "DELETE" });
      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const changeOrder = async (id: number, direction: 'up' | 'down') => {
    try {
      await fetch(`${API_BASE_URL}/sections/${id}/change-order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });

      const refreshed = await fetch(`${API_BASE_URL}/sections/getByCourseId/${courseId}`);
      const updated = await refreshed.json();
      setSections(updated.sort((a: Section, b: Section) => a.order_index - b.order_index));
    } catch (err) {
      console.error("Error changing order:", err);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8 flex justify-start items-start font-sans">
      {/* Left-aligned main card */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-800">Sections</h1>
          <button
            onClick={goToCreate}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            + Create Section
          </button>
        </div>

        {sections.length === 0 ? (
          <p className="text-purple-500">No sections available.</p>
        ) : (
          <ul className="space-y-4">
            {sections.map((section, index) => (
              <li
                key={section.id}
                className="p-4 bg-white border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start"
              >
                <div className="flex-1 pr-4">
                  <h2 className="text-lg font-semibold text-purple-800">{section.title}</h2>
                  <div
                    className="text-purple-700 mb-2"
                    dangerouslySetInnerHTML={{ __html: section.description || "No description available." }}
                  ></div>
                  <p className="text-sm text-purple-500">Order: {section.order_index}</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className="flex gap-1">
                    <button
                      onClick={() => changeOrder(section.id, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg ${index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-100 transition duration-150'}`}
                    >
                      <ArrowUpIcon className="h-5 w-5 text-purple-700" />
                    </button>
                    <button
                      onClick={() => changeOrder(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className={`p-2 rounded-lg ${index === sections.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-100 transition duration-150'}`}
                    >
                      <ArrowDownIcon className="h-5 w-5 text-purple-700" />
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/courses/sections/${section.id}/edit?courseId=${courseId}`)
                      }
                      className="bg-white text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition duration-150"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(section.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-150"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/dashboard/courses/sections/${section.id}/chapters?courseId=${courseId}`)
                      }
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1.5 rounded-md hover:bg-purple-200 transition duration-150 text-sm font-medium"
                    >
                      <BookOpenText className="w-4 h-4" />
                      Chapters
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}










// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { PencilSquareIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
// import { BookOpenText } from 'lucide-react';

// interface Section {
//   id: number;
//   title: string;
//   description: string;
//   order_index: number;
// }

// export default function SectionListPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const courseId = Number(searchParams?.get("courseId"));

//   const [sections, setSections] = useState<Section[]>([]);

//   useEffect(() => {
//     if (!courseId) return;

//     const fetchSections = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/sections/getByCourseId/${courseId}`);
//         const data = await res.json();
//         // Sort by order_index
//         setSections(data.sort((a: Section, b: Section) => a.order_index - b.order_index));
//       } catch (err) {
//         console.error("Error fetching sections:", err);
//       }
//     };

//     fetchSections();
//   }, [courseId]);

//   const goToCreate = () => {
//     router.push(`/dashboard/courses/sections/create?courseId=${courseId}`);
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this section?")) return;
//     try {
//       await fetch(`http://localhost:3000/sections/${id}`, { method: "DELETE" });
//       setSections(prev => prev.filter(s => s.id !== id));
//     } catch (err) {
//       console.error("Error deleting section:", err);
//     }
//   };

//   const changeOrder = async (id: number, direction: 'up' | 'down') => {
//     try {
//       const res = await fetch(`http://localhost:3000/sections/${id}/change-order`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ direction }),
//       });
//       const data = await res.json();
//       console.log(data);

//       // Re-fetch sections to update the UI
//       const refreshed = await fetch(`http://localhost:3000/sections/getByCourseId/${courseId}`);
//       const updated = await refreshed.json();
//       setSections(updated.sort((a: Section, b: Section) => a.order_index - b.order_index));
//     } catch (err) {
//       console.error("Error changing order:", err);
//     }
//   };

//   return (
//     <div className="p-8 min-h-screen bg-purple-50">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Sections</h1>
//           <button
//             onClick={goToCreate}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
//           >
//             + Create Section
//           </button>
//         </div>

//         {sections.length === 0 ? (
//           <p className="text-purple-500">No sections available.</p>
//         ) : (
//           <ul className="space-y-4">
//             {sections.map((section, index) => (
//               <li
//                 key={section.id}
//                 className="p-4 bg-purple-100 rounded-md border border-purple-300 flex justify-between items-center"
//               >
//                 <div>
//                   <h2 className="text-lg font-semibold">{section.title}</h2>
//                   <div
//                     className="text-purple-700 mb-4"
//                     dangerouslySetInnerHTML={{ __html: section.description || "No description available." }}
//                   ></div>
//                   <p className="text-sm text-purple-600">Order: {section.order_index}</p>
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   {/* UP Button */}
//                   <button
//                     onClick={() => changeOrder(section.id, 'up')}
//                     disabled={index === 0}
//                     className={`p-2 rounded-lg ${index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-200'}`}
//                   >
//                     <ArrowUpIcon className="h-5 w-5 text-purple-700" />
//                   </button>

//                   {/* DOWN Button */}
//                   <button
//                     onClick={() => changeOrder(section.id, 'down')}
//                     disabled={index === sections.length - 1}
//                     className={`p-2 rounded-lg ${index === sections.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-200'}`}
//                   >
//                     <ArrowDownIcon className="h-5 w-5 text-purple-700" />
//                   </button>

//                   <button
//                     onClick={() =>
//                       router.push(`/dashboard/courses/sections/${section.id}/edit?courseId=${courseId}`)
//                     }
//                     className="bg-white text-black px-3 py-1 rounded-lg hover:bg-purple-600"
//                   >
//                     <PencilSquareIcon className="h-5 w-5" />
//                   </button>

//                   <button
//                     onClick={() => handleDelete(section.id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
//                   >
//                     <TrashIcon className="h-5 w-5" />
//                   </button>

//                   <button
//                     onClick={() =>
//                       router.push(`/dashboard/courses/sections/${section.id}/chapters?courseId=${courseId}`)
//                     }
//                     className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-200 transition-colors duration-200"
//                   >
//                     <BookOpenText className="w-4 h-4" />
//                     <span className="text-sm font-medium">Chapters</span>
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
