"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CourseForm from "./CourseForm";

export interface Course {
  id: number;
  title: string;
  description: string;
  languageId: number;
  levelId: number;
  duration: number;
  price: number;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Course[]>("https://main.d17r891ad3pi6t.amplifyapp.com/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("❌ Failed to delete course:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">📚 Courses</h2>

      {/* Course Form */}
      <div className="mb-8">
        {editingCourse ? (
          <CourseForm
                      editCourse={editingCourse}
                      onSuccess={() => {
                          setEditingCourse(null);
                          fetchCourses();
                      } } onSubmit={function (formData: any): void {
                          throw new Error("Function not implemented.");
                      } }          />
        ) : (
          <CourseForm onSuccess={fetchCourses} onSubmit={function (formData: any): void {
                          throw new Error("Function not implemented.");
                      } } />
        )}
      </div>

      {/* Course List */}
      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-gray-700">{course.description}</p>
              <p className="text-sm text-gray-600">
                <strong>Language ID:</strong> {course.languageId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Level ID:</strong> {course.levelId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Duration:</strong> {course.duration} hrs
              </p>
              <p className="text-sm text-gray-600">
                <strong>Price:</strong> ₹{course.price}
              </p>

              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => setEditingCourse(course)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteCourse(course.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
