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

  const sectionId = params.sectionId as string;
  const courseId = searchParams.get('courseId');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  // Track which chapter descriptions are expanded
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

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

  const toggleDescription = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!courseId) {
    return <p className="p-6 text-red-600">Error: courseId is missing in URL!</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chapters</h1>

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
        <table className="table table-striped mb-0">
          <thead className  ="table-primary">
            <tr className="bg-gray-100">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Order</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {chapters.map((chapter, index) => (
              <tr key={chapter.id} className="border hover:bg-gray-50 align-top">
                <td className="p-3 border text-center">{index + 1}</td>
                <td className="p-3 border">{chapter.title}</td>
                
                {/* Collapsible Description */}
                <td className="p-3 border">
                  {chapter.description.length > 100 && !expanded[chapter.id]
                    ? `${chapter.description.slice(0, 100)}...`
                    : chapter.description}
                  {chapter.description.length > 100 && (
                    <button
                      onClick={() => toggleDescription(chapter.id)}
                      className="ml-2 text-blue-600 hover:underline"
                    >
                      {expanded[chapter.id] ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </td>

                <td className="p-3 border text-center">{chapter.order_index}</td>
<td className="p-3 border text-center">
  <div className="flex justify-center gap-2">
    <button
      onClick={() =>
        router.push(
          `/dashboard/courses/sections/${sectionId}/chapters/${chapter.id}/edit?courseId=${courseId}`
        )
      }
      className="btn btn-sm btn-primary"
    >
      Edit
    </button>

 <button
  onClick={() =>
    router.push(
      `/dashboard/courses/sections/${sectionId}/chapters/${chapter.id}/upload-resource?courseId=${courseId}`
    )
  }
  className="btn-oval"
>
  Manage
</button>


    <button
      onClick={() => handleDelete(chapter.id)}
      className="btn btn-sm btn-danger"
    >
      Delete
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
