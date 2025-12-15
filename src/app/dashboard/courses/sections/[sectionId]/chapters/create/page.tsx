'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import axios from '@/app/lib/axios';

export default function ChapterCreatePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // ✅ Get IDs only once
  const sectionId = Number(params?.sectionId);
  const courseId = Number(searchParams.get('courseId')); // now courseId will exist
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionId || !courseId) return alert('Missing section or course ID');

    setLoading(true);
    try {
      const res = await axios.post('/chapters', {
        title,
        description,
        order_index: orderIndex,
        is_free_preview: isFreePreview,
        duration: duration || null,
        section_id: sectionId,
        course_id: courseId,
      });

      alert('✅ Chapter created successfully!');

      // Redirect to resource upload page
      router.push(
        `/dashboard/courses/sections/${sectionId}/chapters/${res.data.id}/upload-resource`
      );
    } catch (err) {
      console.error('❌ Error creating chapter:', err);
      alert('Failed to create chapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-purple-50 font-sans">
      <div className="max-w-xl bg-white p-6 shadow-xl rounded-2xl">

        <h1 className="text-2xl font-bold mb-4">Create Chapter</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label text-white">Title</label>
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
            <label className="form-label text-white">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div>
            <label className="form-label text-white">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 5 min"
              className="form-control"
            />
          </div>

          <div>
            <label className="form-label text-white">Order Index</label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              placeholder="Enter order index"
              className="form-control"
            />
          </div>

         <div className="flex items-center justify-between mt-4">
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={isFreePreview}
      onChange={(e) => setIsFreePreview(e.target.checked)}
    />
    <span>Is Free Preview</span>
  </label>

  <div className="flex gap-2">
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => router.back()}
    >
      Close
    </button>

    <button
      type="submit"
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Creating...' : 'Create Chapter'}
    </button>
  </div>
</div>

        </form>
      </div>
    </div>
  );
}
