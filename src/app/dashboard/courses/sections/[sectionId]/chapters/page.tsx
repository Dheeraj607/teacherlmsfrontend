'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import axios from '@/app/lib/axios';

interface Chapter {
  id: number;
  title: string;
  description: string;
  order_index: number;
  is_free_preview: boolean;
  duration?: string;
}

export default function ChapterListPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // ✅ Get sectionId from params and courseId from search params
  const sectionId = params.sectionId as string;
  const courseId = searchParams.get('courseId'); // courseId now comes from query string

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch chapters of this section only
  const fetchChapters = async () => {
    try {
      const res = await axios.get(`/chapters/section/${sectionId}`);
      setChapters(res.data);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  // Delete chapter
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    try {
      await axios.delete(`/chapters/${id}`);
      setChapters((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete chapter');
    }
  };

  if (!courseId) {
    return <p className="p-6 text-red-600">Error: courseId is missing in URL!</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chapters</h1>

        {/* ✅ Add Chapter button */}
        <button
          onClick={() =>
            router.push(
              `/dashboard/courses/sections/${sectionId}/chapters/create?courseId=${courseId}`
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Chapter
        </button>
      </div>

      {loading ? (
        <p>Loading chapters...</p>
      ) : chapters.length === 0 ? (
        <p>No chapters found for this section.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Order</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {chapters.map((chapter, index) => (
              <tr key={chapter.id} className="border hover:bg-gray-50">
                <td className="p-3 border text-center">{index + 1}</td>
                <td className="p-3 border">{chapter.title}</td>
                <td className="p-3 border text-center">{chapter.order_index}</td>

                <td className="p-3 border text-center space-x-2">
                  {/* Edit */}
<button
  onClick={() =>
    router.push(
      `/dashboard/courses/sections/${sectionId}/chapters/${chapter.id}/edit?courseId=${courseId}`
    )
  }
  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
>
  Edit
</button>

                  {/* Manage Resources */}
<button
  onClick={() =>
    router.push(
      `/dashboard/courses/sections/${sectionId}/chapters/${chapter.id}/upload-resource?courseId=${courseId}`
    )
  }
  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
>
  Manage Resources
</button>


                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(chapter.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}





// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import axios from '@/app/lib/axios';

// interface Chapter {
//   id: number;
//   title: string;
//   description: string;
//   order_index: number;
//   is_free_preview: boolean;
//   duration?: string;
// }

// export default function ChapterListPage() {
//   const router = useRouter();
//   const params = useParams();

//   const courseId = params.courseId as string;
//   const sectionId = params.sectionId as string;

//   const [chapters, setChapters] = useState<Chapter[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch chapters of this section only
//   const fetchChapters = async () => {
//     try {
//       const res = await axios.get(`/chapters/section/${sectionId}`);
//       setChapters(res.data);
//     } catch (error) {
//       console.error('Failed to load chapters:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChapters();
//   }, []);

//   // Delete chapter
//   const handleDelete = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this chapter?')) return;

//     try {
//       await axios.delete(`/chapters/${id}`);
//       setChapters((prev) => prev.filter((c) => c.id !== id));
//     } catch (error) {
//       console.error('Delete failed:', error);
//       alert('Failed to delete chapter');
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Chapters</h1>

// <button
//   onClick={() =>
//     router.push(
//       `/dashboard/courses/sections/${sectionId}/chapters/create?courseId=${courseId}`
//     )
//   }
//   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// >
//   + Add Chapter
// </button>


//       </div>

//       {loading ? (
//         <p>Loading chapters...</p>
//       ) : chapters.length === 0 ? (
//         <p>No chapters found for this section.</p>
//       ) : (
//         <table className="w-full border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-3 border">#</th>
//               <th className="p-3 border">Title</th>
//               <th className="p-3 border">Order</th>
//               <th className="p-3 border">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {chapters.map((chapter, index) => (
//               <tr key={chapter.id} className="border hover:bg-gray-50">
//                 <td className="p-3 border text-center">{index + 1}</td>
//                 <td className="p-3 border">{chapter.title}</td>
//                 <td className="p-3 border text-center">{chapter.order_index}</td>

//                 <td className="p-3 border text-center space-x-2">
//                   {/* Edit */}
//                   <button
//                     onClick={() =>
//                       router.push(
//                         `/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapter.id}/edit`
//                       )
//                     }
//                     className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                   >
//                     Edit
//                   </button>

//                   {/* Manage Resources */}
//                   <button
//                     onClick={() =>
//                       router.push(
//                         `/dashboard/courses/${courseId}/sections/${sectionId}/chapters/${chapter.id}/resources`
//                       )
//                     }
//                     className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//                   >
//                     Manage Resources
//                   </button>

//                   {/* Delete */}
//                   <button
//                     onClick={() => handleDelete(chapter.id)}
//                     className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
