"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/utils/axiosInstance";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CKEditorClient = dynamic(() => import("@/app/components/CKEditorClient"), { ssr: false });

interface PackageItem {
  id: number;
  packageName?: string;
  title?: string;
  name?: string;
}

export default function EditWebinarPage() {
  const { id } = useParams();
  const router = useRouter();

  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [webinarData, setWebinarData] = useState<any>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setTeacherId(res.data?.id || res.data?.userId);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setTeacherId(null);
      }
    };
    fetchProfile();
  }, []);

  // Fetch webinar data and packages
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [webinarRes, packagesRes] = await Promise.all([
          api.get(`/webinars/${id}`),
          api.get("/packages"),
        ]);

        const w = webinarRes.data;

        setWebinarData({
          title: w.title || "",
          description: w.description || "",
          date: w.date || "",
          time: w.time || "",
          duration: w.duration || "",
          meetingLink: w.meetingLink || "",
          isRecurring: w.isRecurring || false,
          recurringType: w.recurringType || "",
          packageIds: w.packages?.map((p: any) => p.id) || [],
        });

        setPackages(packagesRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!teacherId)
    return <div className="p-6 text-red-500">⚠️ Failed to load profile. Please log in again.</div>;
  if (!webinarData) return <div className="p-6 text-red-500">❌ Webinar not found.</div>;

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setWebinarData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle package selection
  const handleAddPackage = (packageId: number) => {
    if (!webinarData.packageIds.includes(packageId)) {
      setWebinarData((prev: any) => ({
        ...prev,
        packageIds: [...prev.packageIds, packageId],
      }));
    }
  };

  const handleRemovePackage = (packageId: number) => {
    setWebinarData((prev: any) => ({
      ...prev,
      packageIds: prev.packageIds.filter((id: number) => id !== packageId),
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;

    const payload = {
      title: webinarData.title,
      description: webinarData.description,
      date: webinarData.date,
      time: webinarData.time,
      duration: Number(webinarData.duration),
      teacherId,
      meetingLink: webinarData.meetingLink,
      isRecurring: !!webinarData.isRecurring,
      recurringType: webinarData.recurringType || undefined,
      packageIds: webinarData.packageIds || [],
    };

    try {
      setSubmitting(true);
      const res = await api.put(`/webinars/${id}`, payload);
      alert("Webinar updated successfully!");
      router.push("/dashboard/webinars");
    } catch (err) {
      console.error("Failed to update webinar:", err);
      alert("Failed to update webinar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.push("/dashboard/webinars");

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Webinar</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Package Selection */}
        <div>
          <Label>Select Packages</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {webinarData.packageIds.length > 0
              ? webinarData.packageIds.map((id: number) => {
                  const pkg = packages.find((p) => p.id === id);
                  return (
                    <span
                      key={id}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {pkg?.packageName ?? pkg?.title ?? pkg?.name ?? `Package ${id}`}
                      <button
                        type="button"
                        onClick={() => handleRemovePackage(id)}
                        className="ml-2 text-blue-500 hover:text-blue-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })
              : <p className="text-gray-400 text-sm">No packages selected</p>}
          </div>

          <select
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              if (selectedId) handleAddPackage(selectedId);
              e.target.value = "";
            }}
            value=""
            className="form-select"
          >
            <option value="">-- Select a package --</option>
            {packages
              .filter((pkg) => !webinarData.packageIds.includes(pkg.id))
              .map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.packageName ?? pkg.title ?? pkg.name}
                </option>
              ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <Label>Webinar Title</Label>
          <Input
            name="title"
            value={webinarData.title}
            onChange={handleChange}
            required
             className="form-control"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <CKEditorClient
            value={webinarData.description}
            onChange={(value: string) =>
              setWebinarData((prev: any) => ({ ...prev, description: value }))
            }
          />
        </div>

        {/* Date, Time, Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="date"
              value={webinarData.date}
              onChange={handleChange}
              required
               className="form-control"
            />
          </div>
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              name="time"
              value={webinarData.time}
              onChange={handleChange}
              required
               className="form-control"
            />
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              name="duration"
              value={webinarData.duration}
              onChange={handleChange}
              required
               className="form-control"
            />
          </div>
        </div>

        {/* Meeting Link */}
        <div>
          <Label>Meeting Link</Label>
          <Input
            type="url"
            name="meetingLink"
            value={webinarData.meetingLink}
            onChange={handleChange}
            required
             className="form-control"
          />
        </div>

        {/* Recurring */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isRecurring"
              checked={!!webinarData.isRecurring}
              onChange={handleChange}
              className="mr-2"
            />
            Recurring Webinar
          </label>
          {webinarData.isRecurring && (
            <select
              name="recurringType"
              value={webinarData.recurringType || ""}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">Select Frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          )}
        </div>
        {/* Registration */}
<div>
  <label className="inline-flex items-center mr-4">
    <input
      name="registration"
      type="checkbox"
      checked={!!webinarData.registration}
      onChange={handleChange}
      className="mr-2"
    />
    Enable Registration
  </label>

  {webinarData.registration && (
    <div className="mt-2">
      <label className="inline-flex items-center mr-4">
        <input
          name="restrictToRegistered"
          type="checkbox"
          checked={!!webinarData.restrictToRegistered}
          onChange={handleChange}
          className="mr-2"
        />
        Restrict to Registered
      </label>

      <Input
        name="tags"
        placeholder="Allowed tags (comma separated)"
        value={webinarData.tags || ""}
        onChange={handleChange}
      />
    </div>
  )}
</div>


        {/* Buttons */}
<div className="flex justify-end gap-4 mt-8">
  <button
    type="button"
    onClick={handleCancel}
    className="btn btn-secondary"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={submitting}
    className="btn btn-primary"
  >
    {submitting ? "Updating..." : " Update Webinar"}
  </button>
</div>

      </form>
    </div>
  );
}
