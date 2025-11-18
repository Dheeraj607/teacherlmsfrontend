"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Level {
  id: number;
  level_name: string;
}

export default function SelectLevelPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = Number(searchParams?.get("courseId"));

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch("http://localhost:3000/course-levels");
        const data = await res.json();
        if (Array.isArray(data)) {
          setLevels(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };

    fetchLevels();
  }, []);

  const handleCheckboxChange = (levelId: number) => {
    setSelected((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId]
    );
  };

  const handleNext = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return;
    }

    try {
      await fetch("http://localhost:3000/course-level-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selected.map((levelId) => ({
            course_id: courseId,
            course_level_id: levelId,
          }))
        ),
      });

      console.log("Selected levels saved:", selected);
      // TODO: Navigate to next step if needed
      router.push(`/dashboard/courses/select-categories?courseId=${courseId}`);


    } catch (error) {
      console.error("Error saving levels:", error);
    }
  };

  return (
    // <div className="min-h-screen bg-purple-50 p-8 flex justify-item-center">
    <div className="min-h-screen bg-purple-50 p-8 flex justify-center items-center">

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">
          Select Course Levels
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {levels.map((level) => (
            <label
              key={level.id}
              className={`flex items-center gap-3 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
                selected.includes(level.id)
                  ? "bg-purple-100 border border-blue-500"
                  : "bg-white border border-purple-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(level.id)}
                onChange={() => handleCheckboxChange(level.id)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="text-lg font-medium text-purple-700">
                {level.level_name}
              </span>
            </label>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-purple-500 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-200"
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
}

