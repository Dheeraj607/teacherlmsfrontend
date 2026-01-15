"use client";
export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

import { useSearchParams } from "next/navigation";
import TextEditor from "@/app/components/TextEditor";



const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";

// Separate component that uses useSearchParams()
function CreateSectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [courseId, setCourseId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(1);

  useEffect(() => {
    const courseIdParam = searchParams.get("courseId");
    setCourseId(
      courseIdParam && !isNaN(Number(courseIdParam)) ? Number(courseIdParam) : null
    );
  }, [searchParams]);

useEffect(() => {
  // Track initial page load
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      router.push("/dashboard/courses"); // fallback if no previous page
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);


const handleClose = () => {
  // Check if we can go back
  if (window.history.state?.idx > 0) {
    router.back(); // go back if possible
  } else {
    router.push("/dashboard/courses"); // fallback route
  }
};


const handleSubmit = async () => {
  if (!title.trim() || !courseId) {
    alert("Title is required and course ID must be present.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description.trim() || "",
        order_index: orderIndex,
        course_id: courseId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create section");
    }

    const data = await res.json();
    const sectionId = data.id; // ✅ get the newly created section ID

    router.push(
      `/dashboard/courses/sections/${sectionId}/chapters?courseId=${courseId}`
    );
  } catch (error) {
    console.error("Error creating section:", error);
    alert("Failed to create section. Please try again.");
  }
};


  if (!courseId) {
    return (
      <div className="p-8 min-h-screen bg-purple-50">
        <div className="max-w-xl mx-auto bg-white p-6 shadow-xl rounded-2xl">
          <p className="text-red-600 font-semibold text-center">
            Invalid or missing course ID in URL.
          </p>
        </div>
      </div>
    );
  }

  return (
   <div className="p-8 min-h-screen bg-purple-50 font-sans">
  <div className="max-w-xl ml-4 bg-white p-6 shadow-xl rounded-2xl">

        <h1 className="text-2xl font-bold mb-6 text-purple-800">Create Section</h1>

        <div className="mb-4">
          <label className="form-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Enter section title"
          />
        </div>

       {/* Section Description */}
{/* Section Description */}
<div className="col-12 mb-4">
  <label className="form-label font-medium text-purple-700">
    Section Description <span className="text-red-500">*</span>
  </label>

  {/* TextEditor inside a styled wrapper */}
  <div className="form-control p-0" style={{ minHeight: "150px" }}>
    <TextEditor
      value={description}
      onChange={(value: string) => setDescription(value)}
       // optional: set editor height
    />
  </div>

  {/* Word count validation */}
  <small className="text-muted block mt-1">
    Description must be at least 200 words.{" "}
    {description.trim().split(/\s+/).length < 200 && (
      <span className="text-red-500 ml-2">
        {/* Currently {description.trim().split(/\s+/).length} words */}
      </span>
    )}
  </small>
</div>




        <div className="mb-6">
          <label className="form-label">Order Index</label>
         <input
  type="number"
  value={orderIndex === 0 ? "" : orderIndex}
  onChange={(e) =>
    setOrderIndex(e.target.value ? parseInt(e.target.value) : 0)
  }
  className="form-control"
  min={1}
/>
  
        </div>

        <div className="flex justify-end gap-2">
        <button className="btn btn-secondary" onClick={handleClose}>
  Close
</button>

          <button onClick={handleSubmit} className="btn btn-primary">
            Save and Go to Chapters
          </button>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function CreateSectionPage() {
  return (
    <Suspense fallback={
      <div className="p-8 min-h-screen bg-purple-50 flex items-center justify-center">
        <p className="text-lg text-purple-700">Loading...</p>
      </div>
    }>
      <CreateSectionContent />
    </Suspense>
  );
}




// "use client";
// export const dynamic = 'force-dynamic';

// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import CKEditorInput from "@/app/components/CKEditorInput";

//   const API_URL =
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://ec2-15-206-165-29.ap-south-1.compute.amazonaws.com:3000";


// export default function CreateSectionPage() {
//   const router = useRouter();
//   // const searchParams = useSearchParams();

//   // const courseIdParam = searchParams?.get("courseId");
//   // const courseId =courseIdParam && !isNaN(Number(courseIdParam)) ? Number(courseIdParam) : null;
// const [courseId, setCourseId] = useState<number | null>(null);

// useEffect(() => {
//   const params = useSearchParams();
//   const courseIdParam = params?.get("courseId");
//   setCourseId(courseIdParam && !isNaN(Number(courseIdParam)) ? Number(courseIdParam) : null);
// }, []);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [orderIndex, setOrderIndex] = useState<number>(1);

//   const handleSubmit = async () => {
//     if (!title.trim() || !courseId) {
//       alert("Title is required and course ID must be present.");
//       return;
//     }

//     try {
//       await fetch(`${API_URL}/sections`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           description,
//           order_index: orderIndex,
//           course_id: courseId,
//         }),
//       });

//       router.push(`/dashboard/courses/sections?courseId=${courseId}`);
//     } catch (error) {
//       console.error("Error creating section:", error);
//     }
//   };

//   if (!courseId) {
//     return (
//       <div className="p-8 min-h-screen bg-purple-50">
//         <div className="max-w-xl mx-auto bg-white p-6 shadow-xl rounded-2xl">
//           <p className="text-red-600 font-semibold">
//             Invalid or missing course ID in URL.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 min-h-screen bg-purple-50 font-sans">
//       <div className="max-w-xl bg-white p-6 shadow-xl rounded-2xl">

//         <h1 className="text-2xl font-bold mb-6">Create Section</h1>

//         <div className="mb-4">
//           <label className="form-label text-white">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="form-control"
//             placeholder="Enter section title"
//           />
//         </div>

//         {/* <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md"
//             placeholder="Enter section description"
//             rows={4}
//           />
//         </div> */}

//         <div className="mb-4">
//           <label className="form-label">Description</label>
//           <CKEditorInput value={description} onChange={setDescription} />
//         </div>

//         <div className="mb-6">
//           <label className="form-label">Order Index</label>
//           <input
//             type="number"
//             value={orderIndex}
//             onChange={(e) => setOrderIndex(parseInt(e.target.value))}
//             className="form-control"
//             min={1}
//           />
//         </div>

//        <div className="d-flex justify-content-end gap-2">

//   <button
//     className="btn btn-secondary"
//     onClick={() => router.back()}
//   >
//     Close
//   </button>

//   <button
//     onClick={handleSubmit}
//     className="btn btn-primary"
//   >
//     Save and Go to Chapters
//   </button>

// </div>

//       </div>
//     </div>
//   );
// }
