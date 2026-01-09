"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!email || !newPassword) {
      toast.error("Email and new password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        email,
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      toast.success(res.data.message);
      router.push("/login"); // redirect to login
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mt-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="col-md-4 offset-md-4">
        <h3 className="mb-4">Reset Password</h3>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Current Password (optional)</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          disabled={loading}
          onClick={handleUpdate}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </section>
  );
}
