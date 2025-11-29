"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    primaryEmail: "",
    primaryPhone: "",
    state: "",
  });

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await api.get("/users/my-students");

      const student = res.data.find((s: any) => s.id === Number(id));

      if (!student) {
        alert("Student not found");
        router.push("/dashboard/registered-students");
        return;
      }

      setFormData({
        firstName: student.firstName || "",
        middleName: student.middleName || "",
        lastName: student.lastName || "",
        primaryEmail: student.contact?.primaryEmail || "",
        primaryPhone: student.contact?.primaryPhone || "",
        state: student.address?.state || "",
      });
    } catch (err) {
      console.error("Error loading student:", err);
      alert("Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/users/update-student/${id}`, formData);

      alert("Student updated!");
      router.push("/dashboard/registered-students");
    } catch (err: any) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading student...</p>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Student</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <Label>First Name</Label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Middle Name</Label>
          <Input
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Last Name</Label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            name="primaryEmail"
            value={formData.primaryEmail}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            name="primaryPhone"
            value={formData.primaryPhone}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>State</Label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
