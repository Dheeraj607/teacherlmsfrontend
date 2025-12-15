"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WebinarForm from "@/app/components/WebinarForm";
import api from "@/utils/axiosInstance"; // ✅ Custom axios instance that includes token

export default function CreateWebinarPage() {
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        console.log("👤 User profile fetched:", res.data);
        setTeacherId(res.data?.id || res.data?.userId);
      } catch (err: any) {
        console.error("❌ Failed to fetch user profile:", err);
        setTeacherId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6">Loading your profile...</p>;

  if (teacherId === null)
    return (
      <div className="p-6 text-red-500">
        ⚠️ Failed to load your profile (unauthorized). Please log in again.
      </div>
    );

const onSubmit = async (fd: FormData): Promise<{ id: number }> => {
  const s = (v: FormDataEntryValue | null) =>
    v == null ? "" : String(v).trim();
  const n = (v: FormDataEntryValue | null) => {
    const x = parseInt(s(v), 10);
    return Number.isNaN(x) ? undefined : x;
  };
  const b = (v: FormDataEntryValue | null) => s(v) === "true";


  const packageIds = fd.getAll("packageIds").map(v => parseInt(v.toString(), 10));

  // ✅ FIX: Correctly get packageId from form
  // const packageId = n(fd.get("packageId")) || undefined;

  const payload = {
    title: s(fd.get("title")),
    description: s(fd.get("description")),
    date: s(fd.get("date")),
    time: s(fd.get("time")),
    duration: n(fd.get("duration")),
    teacherId: teacherId!,
    meetingLink: s(fd.get("meetingLink")),
    isRecurring: b(fd.get("isRecurring")),
    recurringType: s(fd.get("recurringType")) || undefined,
    packageIds, // ✅ ensure this field exists
  };

  try {
    console.log("📤 Sending webinar:", payload);
    const res = await api.post("/webinars", payload);

    console.log("✅ Webinar created:", res.data);
    router.push("/dashboard/webinars");
    router.refresh();

    return { id: res.data.id };
  } catch (err: any) {
    console.error("❌ Failed to create webinar:", err.response?.data || err);
    return { id: -1 };
  }
};


    return (
      <div className="p-6 font-sans ">
        <h2 className="text-2xl font-semibold mb-4">Create Webinar</h2>
        <WebinarForm onSubmit={onSubmit} loggedInUserId={teacherId} />
      </div>
    );
}
