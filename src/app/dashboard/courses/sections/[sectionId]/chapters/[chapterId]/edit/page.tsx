'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import axios from '@/services/api';


export default function ChapterEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const sectionId = Number(params?.sectionId);
  const chapterId = Number(params?.chapterId);
  const courseId = Number(searchParams.get('courseId'));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch chapter data
useEffect(() => {
  if (!chapterId) return;

  const fetchChapter = async () => {
    try {
      const res = await axios.get(`/chapters/${chapterId}`);
      const data = res.data;

      setTitle(data.title || '');
      setDescription(data.description || '');

      // Fix duration
      if (!data.duration) {
        setDuration('');
      } else if (typeof data.duration === 'string') {
        setDuration(data.duration);
      } else if (typeof data.duration === 'object') {
        const dur = data.duration as { hours?: number; minutes?: number; seconds?: number };
        const parts: string[] = [];
        if (dur.hours) parts.push(`${dur.hours} hr`);
        if (dur.minutes) parts.push(`${dur.minutes} min`);
        if (dur.seconds) parts.push(`${dur.seconds} sec`);
        setDuration(parts.join(' '));
      }

      setOrderIndex(data.order_index || 1);
      setIsFreePreview(data.is_free_preview || false);
    } catch (err) {
      console.error('❌ Error fetching chapter:', err);
      alert('Failed to fetch chapter data');
    } finally {
      setFetching(false);
    }
  };

  fetchChapter();
}, [chapterId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionId || !courseId || !chapterId) return alert('Missing IDs');

    setLoading(true);
    try {
    await axios.patch(`/chapters/${chapterId}`, {
  title,
  description,
  order_index: orderIndex,
  is_free_preview: isFreePreview,
  duration: duration || null,
  section_id: sectionId,
  course_id: courseId,
});


      alert('✅ Chapter updated successfully!');

      // Redirect to resource upload page
      router.push(
        `/dashboard/courses/sections/${sectionId}/chapters/${chapterId}/upload-resource`
      );
    } catch (err) {
      console.error('❌ Error updating chapter:', err);
      alert('Failed to update chapter');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 min-h-screen flex justify-center items-center">
        <p>Loading chapter data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-purple-50">
      <div className="max-w-xl  bg-white p-6 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Edit Chapter</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
              className="form-control"
            />
          </div>

          <div>
            <label className="block text-purple-700 font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              className="form-control"
            />
          </div>

          <div>
            <label className="block text-purple-700 font-medium mb-2">Duration</label>
<input
  type="text"
  value={duration}
  onChange={(e) => setDuration(e.target.value)}
  placeholder="e.g., 5 min"
  className="form-control"
/>

          </div>

          <div>
            <label className="block text-purple-700 font-medium mb-2">Order Index</label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              placeholder="Enter order index"
              className="form-control"
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isFreePreview}
              onChange={(e) => setIsFreePreview(e.target.checked)}
            />
            <span>Is Free Preview</span>
          </label>

  <div className="flex justify-end mb-4 gap-3">
<button
  type="button"
  onClick={() => router.back()}
  className="btn btn-secondary"
>
  Close
</button>


  <button
    type="submit"
    disabled={loading}
    className="btn btn-primary"
  >
    {loading ? 'Updating...' : 'Update Chapter'}
  </button>
</div>


        </form>
      </div>
    </div>
  );
}
