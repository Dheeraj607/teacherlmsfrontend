"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import CKEditorInput from "@/app/components/CKEditorInput";

export default function EditSectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const sectionId = params?.sectionId as string;
  const courseIdParam = searchParams?.get("courseId");
  const courseId = courseIdParam && !isNaN(Number(courseIdParam)) ? Number(courseIdParam) : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(1);

  useEffect(() => {
    async function fetchSection() {
      try {
        if (!sectionId) return;
        const res = await axios.get(`http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/sections/${sectionId}`);
        const data = res.data;
        setTitle(data.title);
        setDescription(data.description);
        setOrderIndex(data.order_index);
      } catch (error) {
        console.error("Failed to fetch section:", error);
      }
    }

    fetchSection();
  }, [sectionId]);

  const handleSubmit = async () => {
    if (!title.trim() || !courseId) {
      alert("Title is required and course ID must be present.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/sections/${sectionId}`, {
        title,
        description,
        order_index: orderIndex,
        course_id: courseId,
      });
      router.push(`/dashboard/courses/sections?courseId=${courseId}`);
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/courses/sections?courseId=${courseId}`);
  };

  if (!courseId) {
    return (
      <div className="p-8 min-h-screen bg-purple-50">
        <div className="max-w-xl mx-auto bg-white p-6 shadow-xl rounded-2xl">
          <p className="text-red-600 font-semibold">
            Invalid or missing course ID in URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-purple-50 font-sans">
      <div className="max-w-xl  bg-white p-6 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Section</h1>

        <div className="mb-4">
          <label className="block text-purple-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Enter section title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 font-medium mb-2">Description</label>
          <CKEditorInput value={description} onChange={setDescription} />
        </div>

        <div className="mb-6">
          <label className="block text-purple-700 font-medium mb-2">Order Index</label>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(parseInt(e.target.value))}
            className="form-control"
            min={1}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Update Section
          </button>
        </div>
      </div>
    </div>
  );
}
