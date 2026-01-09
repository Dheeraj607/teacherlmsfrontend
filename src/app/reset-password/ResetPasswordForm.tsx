"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      toast.success(res.data.message || "Password updated successfully");
      setDone(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mt-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="col-md-4 offset-md-4">
        <h4 className="mb-3">Reset Password</h4>

        {done ? (
          <>
            <p className="text-success mb-3">
              ✅ Password updated successfully
            </p>
            <button
              className="btn btn-success w-100"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="btn btn-primary w-100"
              onClick={handleReset}
              disabled={loading || !token}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
