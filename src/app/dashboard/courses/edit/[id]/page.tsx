"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CKEditorInput from "@/app/components/CKEditorInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Language {
  id: number;
  name?: string;
  language?: string;
}

interface PackageItem {
  id?: number;
  package_id?: number;
  title?: string;
  name?: string;
}

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [languageId, setLanguageId] = useState<number>();
  const [publish, setPublish] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [packageIds, setPackageIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await axios.get(`http://localhost:3000/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const c = courseRes.data?.data ?? courseRes.data;

        setTitle(c.title ?? "");
        setDescription(c.description ?? "");
        setStartDate(c.startDate ?? "");
        setLanguageId(c.language?.id ?? c.languageId ?? undefined);
        setPublish(c.publish ?? false);
        setPackageIds((c.packages ?? []).map((p: PackageItem) => p.id ?? p.package_id ?? 0));
        setThumbnailPreview(c.thumbnailUrl ?? "");

        // Fetch languages & packages
        const [langRes, pkgRes] = await Promise.all([
          axios.get("http://localhost:3000/languages", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:3000/packages", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setLanguages(Array.isArray(langRes.data) ? langRes.data : langRes.data.languages ?? []);
        setPackages(Array.isArray(pkgRes.data) ? pkgRes.data : pkgRes.data.packages ?? []);
      } catch (err: any) {
        console.error("Error fetching data:", err.response?.data || err.message);
        alert("Failed to fetch course data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Get user ID from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
      } catch {
        console.warn("Invalid user data in localStorage");
      }
    }
  }, [id, router]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateCourse = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Session expired. Please log in again.");
      router.push("/");
      return;
    }

    if (!title || !description) {
      alert("Please fill all required fields (title and description).");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", String(userId ?? 1));
      formData.append("title", title);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("languageId", String(languageId ?? ""));
      formData.append("publish", String(publish));
      formData.append("packageIds", JSON.stringify(packageIds));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else if (thumbnailPreview) {
        formData.append("thumbnailUrl", thumbnailPreview);
      }

      const res = await axios.put(`http://localhost:3000/courses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedCourse = res.data.data;

      // ✅ Reflect updated values in form
      setTitle(updatedCourse.title);
      setDescription(updatedCourse.description);
      setStartDate(updatedCourse.startDate);
      setLanguageId(updatedCourse.language?.id ?? undefined);
      setPublish(updatedCourse.publish ?? false);
      setPackageIds((updatedCourse.packages ?? []).map((p: PackageItem) => p.id ?? p.package_id ?? 0));
      setThumbnailPreview(updatedCourse.thumbnailUrl ?? "");

      alert("✅ Course updated successfully!");
      router.push("/dashboard/courses"); // Remove this line if you want to stay on page
    } catch (err: any) {
      console.error("Error updating course:", err.response?.data || err.message);
      alert("Failed to update course: " + JSON.stringify(err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => router.push("/dashboard/courses");

  if (loading) return <div className="text-center text-gray-600 p-8">Loading course...</div>;

  return (
    <div className="relative min-h-screen bg-purple-50 py-12 px-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto bg-white p-10 md:p-12 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Edit Course</h1>
        <p className="text-gray-600 mb-10 text-sm">Edit the details of your course and update its settings.</p>

        {/* Packages */}
        <div className="mb-6">
          <Label>Select Packages</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {packageIds.length > 0 ? (
              packageIds.map((id) => {
                const pkg = packages.find((p) => p.id === id || p.package_id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {pkg?.title ?? pkg?.name ?? `Package ${id}`}
                    <button
                      type="button"
                      onClick={() => setPackageIds((prev) => prev.filter((pid) => pid !== id))}
                      className="ml-2 text-purple-500 hover:text-purple-700 font-bold"
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
            className="w-full p-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">-- Select a package --</option>
            {packages
              .filter((pkg) => !packageIds.includes(pkg.id ?? pkg.package_id ?? 0))
              .map((pkg, idx) => {
                const key = pkg.id ?? pkg.package_id ?? idx;
                const title = pkg.title ?? pkg.name ?? `Package ${key}`;
                const val = pkg.id ?? pkg.package_id ?? key;
                return (
                  <option key={`pkg-${key}`} value={String(val)}>
                    {title}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Course Form */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Course Description</Label>
            <div className="mt-2">
              <CKEditorInput value={description} onChange={setDescription} />
            </div>
          </div>

          <div>
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="language">Course Language</Label>
            <select
              id="language"
              value={String(languageId ?? "")}
              onChange={(e) => setLanguageId(Number(e.target.value))}
              className="w-full p-2 border rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">-- Select a language --</option>
              {languages.map((lang, idx) => {
                const key = lang.id ?? idx;
                const title = lang.language ?? lang.name ?? `Language ${key}`;
                const val = lang.id ?? key;
                return (
                  <option key={`lang-${key}`} value={String(val)}>
                    {title}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Thumbnail */}
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
                alt="Preview"
                className="mt-3 w-48 h-28 object-cover rounded-md shadow"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="publish"
              checked={publish}
              onCheckedChange={(val) => setPublish(Boolean(val))}
            />
            <Label htmlFor="publish" className="text-sm text-gray-700">
              Publish this course immediately
            </Label>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-end gap-4">
          <Button
            onClick={handleCancel}
            className="px-8 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-md rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCourse}
            className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white text-md rounded-md"
          >
            Update Course
          </Button>
        </div>
      </div>
    </div>
  );
}
