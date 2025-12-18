"use client";

import { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import { Course } from "./CourseList";
import axios from "axios";
import router from "next/router";
import { Label } from "@radix-ui/react-label";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}


interface CourseFormProps {
  onSubmit: (formData: any) => void;
  editCourse?: Course | null;
  onSuccess: () => void;
}

interface PackageItem {
  id?: number;
  title?: string;
  name?: string;
  packageName?: string;
}

export default function CourseForm({ onSubmit }: CourseFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [languageId, setLanguageId] = useState<number>(1);
  const [startDate, setStartDate] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [packageIds, setPackageIds] = useState<number[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch all packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        await new Promise((r) => setTimeout(r, 500));
        token = localStorage.getItem("accessToken");
      }

      if (!token) {
        console.error("❌ No access token found for fetching packages");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/packages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(res.data);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // ✅ Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("No access token found!");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/upload/thumbnail`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setThumbnailUrl(res.data.url); // ✅ Store the uploaded URL
    } catch (err) {
      console.error("❌ Thumbnail upload failed:", err);
      alert("Thumbnail upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      userId: 1,
      title,
      description,
      languageId,
      startDate,
      price,
      thumbnailUrl, // ✅ Use uploaded URL here
      packageIds,
      publish: false,
      createdBy: 1,
    };

    console.log("Submitting course payload:", payload);
    onSubmit(payload);
  };

  if (loading) return <p className="text-center text-gray-600">Loading packages...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      {/* Description */}
      <TextEditor value={description} onChange={setDescription} />

      {/* Language */}
      <input
        type="number"
        placeholder="Language ID"
        value={languageId}
        onChange={(e) => setLanguageId(parseInt(e.target.value))}
        className="border p-2 w-full rounded"
        required
      />

      {/* Start Date */}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
        className="border p-2 w-full rounded"
      />

      {/* ✅ Thumbnail Upload */}
{/* Thumbnail */}
<div>
  <Label htmlFor="thumbnail">Course Thumbnail</Label>
  <input
    id="thumbnail"
    type="file"
    accept="image/*"
    className="mt-2 border p-2 w-full rounded-md"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No token found. Please log in again.");
        router.push("/");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          `${API_BASE_URL}/upload/thumbnail`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data?.url) {
          setThumbnailFile(res.data.url);
        } else {
          alert("Upload failed. No URL returned.");
        }
      } catch (err: any) {
        console.error("❌ Thumbnail upload failed:", err);
        alert("Thumbnail upload failed. Please try again.");
      }
    }}
  />

  {thumbnailFile && (
    <div className="mt-3">
      <img
        src={thumbnailFile}
        alt="Thumbnail preview"
        className="w-48 h-28 object-cover rounded border"
      />
      <p className="text-xs text-gray-500 mt-1">Preview of uploaded image</p>
    </div>
  )}
</div>


      {/* ✅ Multiple package selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Packages <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-2 mb-2">
          {packageIds.length > 0 ? (
            packageIds.map((id) => {
              const pkg = packages.find((p) => p.id === id);
              return (
                <span
                  key={id}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {pkg?.packageName ?? pkg?.title ?? pkg?.name ?? `Package ${id}`}
                  <button
                    type="button"
                    onClick={() =>
                      setPackageIds((prev) => prev.filter((pid) => pid !== id))
                    }
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
          value=""
          className="w-full p-2 border rounded shadow-sm"
        >
          <option value="">-- Select a package --</option>
          {packages
            .filter((pkg) => !packageIds.includes(pkg.id!))
            .map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.packageName ?? pkg.title ?? pkg.name ?? `Package ${pkg.id}`}
              </option>
            ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Save Course"}
      </button>
    </form>
  );
}
