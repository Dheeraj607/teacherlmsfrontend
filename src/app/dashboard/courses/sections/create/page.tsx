// // course/sections/create/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CKEditorInput from "@/app/components/CKEditorInput";

export default function CreateSectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseIdParam = searchParams?.get("courseId");
  const courseId =courseIdParam && !isNaN(Number(courseIdParam)) ? Number(courseIdParam) : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(1);

  const handleSubmit = async () => {
    if (!title.trim() || !courseId) {
      alert("Title is required and course ID must be present.");
      return;
    }

    try {
      await fetch("http://localhost:3000/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          order_index: orderIndex,
          course_id: courseId,
        }),
      });

      router.push(`/dashboard/courses/sections?courseId=${courseId}`);
    } catch (error) {
      console.error("Error creating section:", error);
    }
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
    <div className="p-8 min-h-screen bg-purple-50">
      <div className="max-w-xl bg-white p-6 shadow-xl rounded-2xl">

        <h1 className="text-2xl font-bold mb-6">Create Section</h1>

        <div className="mb-4">
          <label className="form-label text-white">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Enter section title"
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter section description"
            rows={4}
          />
        </div> */}

        <div className="mb-4">
          <label className="form-label">Description</label>
          <CKEditorInput value={description} onChange={setDescription} />
        </div>

        <div className="mb-6">
          <label className="form-label">Order Index</label>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(parseInt(e.target.value))}
            className="form-control"
            min={1}
          />
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Save and Go to chapters
          </button>
        </div>
      </div>
    </div>
  );
}
