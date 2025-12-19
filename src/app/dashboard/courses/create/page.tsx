"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CKEditorInput from "@/app/components/CKEditorInput";
import axios from "axios";

 const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://d1ojm6zdv3m37g.cloudfront.net";


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

export default function CreateCoursePage() {
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Session expired. Please log in again.");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [langRes, pkgRes] = await Promise.all([
          axios.get(`${API_URL}/languages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/packages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLanguages(langRes.data.languages ?? langRes.data ?? []);
        setPackages(pkgRes.data.packages ?? pkgRes.data ?? []);
      } catch (err: any) {
        console.error("🚨 Error fetching data:", err.response?.data || err.message);
      }
    };

    fetchData();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
      } catch {
        console.warn("Invalid user data in localStorage");
      }
    }
  }, [router]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

const handleSaveAndNext = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("No token found. Please log in again.");
    router.push("/");
    return;
  }

  if (!title || !description) {
    alert("Please fill all required fields (title and description).");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("userId", String(userId || 1));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("languageId", String(languageId || ""));
    formData.append("publish", String(publish));
    formData.append("packageIds", JSON.stringify(packageIds));//change here 

    // packageIds.forEach((id) => formData.append("packageIds", String(id)));

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile); // ✅ must match backend interceptor name
    }

    // ✅ FIXED: correct endpoint
    const res = await axios.post(`${API_URL}/courses`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const courseId = res.data?.id || res.data?.course?.id;

    alert("✅ Course created successfully!");
    router.push(`/dashboard/courses/select-level?courseId=${courseId}`);
  } catch (error: any) {
    console.error("❌ Error creating course:", error.response?.data || error.message);
    alert(
      "Failed to create course: " +
        JSON.stringify(error.response?.data?.message || error.response?.data)
    );
  }
};



  return (
    <div className="relative min-h-screen bg-purple-50 py-12 px-6 overflow-hidden font-sans">
      <div className="relative z-10 max-w-5xl  bg-white p-10 md:p-12 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Course Landing Page
        </h1>
        <p className="text-gray-600 mb-10 text-sm">
          This is the first thing students will see when they find your course.
          Make it count!
        </p>

        {/* ✅ Package Selection */}
     <div className="mb-6">
  <Label htmlFor="packageId">
    Select Packages <span className="text-red-500">*</span>
  </Label>

  {/* Selected Pills */}
  <div className="flex flex-wrap gap-2 mb-2">
    {packageIds.length > 0 ? (
      packageIds.map((id) => {
        const pkg = packages.find(
          (p) => p.id === id || p.package_id === id
        );
        return (
          <span
            key={id}
            className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
          >
            {pkg?.title ?? pkg?.name ?? `Package ${id}`}
            <button
              type="button"
              onClick={() =>
                setPackageIds((prev) => prev.filter((pid) => pid !== id))
              }
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

  {/* Bootstrap Styled Select */}
  <select
    onChange={(e) => {
      const selectedId = Number(e.target.value);
      if (selectedId && !packageIds.includes(selectedId)) {
        setPackageIds((prev) => [...prev, selectedId]);
      }
      e.target.value = "";
    }}
    className="form-select"   // <-- Bootstrap style applied
    aria-label="Select Packages"
  >
    <option value="">Select the package</option>

    {packages
      .filter(
        (pkg) => !packageIds.includes(pkg.id ?? pkg.package_id ?? 0)
      )
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


        {/* ✅ Course Form */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">
              Course Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. The Complete Python Bootcamp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

        <div className="col-12 mb-3">
  <label className="form-label">
    Course Description <span className="text-red-500">*</span>
  </label>

  {/* CKEditor inside Bootstrap form-control wrapper */}
  <div className="form-control p-0" style={{ height: "auto" }}>
    <CKEditorInput value={description} onChange={setDescription} />
  </div>

  <small className="text-muted">
    Description must be at least 200 words.
  </small>
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

          {/* ✅ Thumbnail Upload */}
        <div className="col-12 mb-3">
  <label htmlFor="thumbnail" className="form-label">
    Course Thumbnail
  </label>

  <input
    id="thumbnail"
    type="file"
    accept="image/*"
    onChange={handleThumbnailChange}
    className="form-control"
  />

  {thumbnailPreview && (
    <img
      src={thumbnailPreview}
      alt="Preview"
      className="mt-3 rounded shadow"
      style={{ width: "200px", height: "120px", objectFit: "cover" }}
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

      <div className="mt-10 text-right flex justify-end gap-3">
  
  {/* Close Button */}
<button
  type="button"
  className="btn btn-secondary"
  onClick={() => window.history.back()}
>
  Close
</button>


  {/* Save Button */}
  <Button
    onClick={handleSaveAndNext}
    className="btn btn-primary"
  >
    Save & Continue
  </Button>

</div>
      </div>
    </div>
  );
}
