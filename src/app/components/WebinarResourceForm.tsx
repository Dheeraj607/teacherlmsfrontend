'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function WebinarResourceForm() {
  const [file, setFile] = useState<File | null>(null);
  const [resourceName, setResourceName] = useState('');
  const [webinarId, setWebinarId] = useState('');
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    if (!file || !resourceName || !webinarId || !resourceTypeId) {
      setError('Please fill in all fields and select a file.');
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resourceName', resourceName);
      formData.append('webinarId', webinarId);
      formData.append('resourceTypeId', resourceTypeId);

      const response = await axios.post(
        'http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/webinar-resources/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Upload success:', response.data);
      router.push('/webinars/resources'); // ✅ Redirect after success
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Resource Name"
        value={resourceName}
        onChange={(e) => setResourceName(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <input
        type="number"
        placeholder="Webinar ID"
        value={webinarId}
        onChange={(e) => setWebinarId(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <input
        type="number"
        placeholder="Resource Type ID"
        value={resourceTypeId}
        onChange={(e) => setResourceTypeId(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <input
        type="file"
        accept=".pdf,.ppt,.pptx,.mp4,.avi,.mkv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full"
        required
      />

      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? 'Uploading...' : 'Upload Resource'}
      </button>
    </form>
  );
}
