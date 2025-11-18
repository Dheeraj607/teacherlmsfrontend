
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

export default function SelectCategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = Number(searchParams?.get("courseId"));

  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/category");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const saveCategories = async () => {
    if (!courseId) {
      alert("Course ID is missing.");
      return false;
    }

    try {
      await fetch("http://localhost:3000/course-category-mappings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selected.map((categoryId) => ({
            course_id: courseId,
            category_id: categoryId,
          }))
        ),
      });

      console.log("Selected categories saved:", selected);
      return true;
    } catch (error) {
      console.error("Error saving categories:", error);
      return false;
    }
  };

  const handleSave = async () => {
    const saved = await saveCategories();
    if (saved) {
      router.push("/dashboard/courses"); // go to course list
    }
  };

  const handleSaveAndNext = async () => {
    const saved = await saveCategories();
    if (saved) {
      router.push(`/dashboard/courses/sections?courseId=${courseId}`); // go to section list
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8 flex justify-center items-center">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">
          Select Course Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center gap-3 p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${
                selected.includes(category.id)
                  ? "bg-purple-100 border border-green-500"
                  : "bg-white border border-purple-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="w-5 h-5 text-green-600"
              />
              <span className="text-lg font-medium text-purple-700">
                {category.name}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg text-md font-medium hover:bg-purple-700 transition duration-200"
          >
            Save
          </button>

          <button
            onClick={handleSaveAndNext}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg text-md font-medium hover:bg-purple-700 transition duration-200"
          >
            Save & Go to Sections
          </button>
        </div>
      </div>
    </div>
  );
}
