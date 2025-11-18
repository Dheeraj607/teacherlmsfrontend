"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import TextEditor from "@/app/components/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PackageItem {
  id: number;
  title?: string;
  name?: string;
  packageName?: string;
}

interface Language {
  id: number;
  name: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  startDate: string;
  languageId: number | null;
  thumbnailUrl: string | null;
  publish: boolean;
  packages: PackageItem[];
}

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [packageIds, setPackageIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Fetch course details
        const courseRes = await axios.get(`http://localhost:3000/courses/${id}`, { headers });
        const c = courseRes.data?.data ?? courseRes.data;

        setCourse({
          id: c.id,
          title: c.title || "",
          description: c.description || "",
          startDate: c.startDate || "",
          languageId: c.language?.id ?? c.languageId ?? null,
          thumbnailUrl: c.thumbnailUrl ?? "",
          publish: c.publish ?? false,
          packages: c.packages || [],
        });

        setPackageIds((c.packages || []).map((p: PackageItem) => p.id));
        setThumbnailPreview(c.thumbnailUrl ?? "");

        // ✅ Fetch languages & packages
        const [langRes, pkgRes] = await Promise.all([
          axios.get("http://localhost:3000/languages", { headers }),
          axios.get("http://localhost:3000/packages", { headers }),
        ]);

        setLanguages(Array.isArray(langRes.data) ? langRes.data : langRes.data.data || []);
        setPackages(Array.isArray(pkgRes.data) ? pkgRes.data : pkgRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in again");
        return;
      }

      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("startDate", course.startDate || "");
      if (course.languageId) formData.append("languageId", String(course.languageId));
      formData.append("publish", String(course.publish));
      packageIds.forEach((id) => formData.append("packageIds", String(id)));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile); // ✅ matches backend interceptor name
      } else if (course.thumbnailUrl) {
        formData.append("thumbnailUrl", course.thumbnailUrl); // keep existing URL if not replaced
      }

      const res = await axios.put(`http://localhost:3000/courses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        alert("✅ Course updated successfully!");
        router.push("/dashboard/courses");
      }
    } catch (err: any) {
      console.error("Update failed:", err);
      alert("❌ Failed to update course: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => router.push("/dashboard/courses");

  if (loading || !course) {
    return <div className="text-center text-gray-600 p-8">Loading course...</div>;
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Course</h2>

      {/* Title */}
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          type="text"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <TextEditor
          value={course.description}
          onChange={(val) => setCourse({ ...course, description: val })}
        />
      </div>

      {/* Start Date */}
      <div>
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={course.startDate || ""}
          onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
        />
      </div>

      {/* Language */}
      <div>
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          value={course.languageId ?? ""}
          onChange={(e) => setCourse({ ...course, languageId: Number(e.target.value) })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Packages */}
      <div>
        <Label>Select Packages</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {packageIds.length > 0 ? (
            packageIds.map((pid) => {
              const pkg = packages.find((p) => p.id === pid);
              return (
                <span
                  key={pid}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {pkg?.packageName ?? pkg?.title ?? pkg?.name ?? `Package ${pid}`}
                  <button
                    type="button"
                    onClick={() => setPackageIds((prev) => prev.filter((id) => id !== pid))}
                    className="ml-2 text-blue-500 hover:text-blue-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">No packages selected</p>
          )}
        </div>

        <select
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            if (selectedId && !packageIds.includes(selectedId)) {
              setPackageIds((prev) => [...prev, selectedId]);
            }
            e.target.value = "";
          }}
          className="w-full p-2 border rounded shadow-sm"
        >
          <option value="">-- Select a package --</option>
          {packages
            .filter((pkg) => !packageIds.includes(pkg.id))
            .map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.packageName ?? pkg.title ?? pkg.name ?? `Package ${pkg.id}`}
              </option>
            ))}
        </select>
      </div>

      {/* ✅ Thumbnail Upload */}
      <div>
        <Label htmlFor="thumbnail">Course Thumbnail</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="mt-2"
        />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            className="mt-3 w-48 h-28 object-cover rounded-md shadow"
          />
        )}
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3">
        <input
          id="publish"
          type="checkbox"
          checked={course.publish}
          onChange={(e) => setCourse({ ...course, publish: e.target.checked })}
        />
        <Label htmlFor="publish">Publish this course immediately</Label>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Update Course
        </Button>
      </div>
    </form>
  );
}
