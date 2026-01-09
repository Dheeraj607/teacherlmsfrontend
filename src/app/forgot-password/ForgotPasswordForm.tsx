"use client";

import api from "@/utils/axiosInstance";
import { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      setSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="d-flex align-items-center justify-content-center"
    
    >
      <ToastContainer position="top-center" autoClose={3000} />

      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4" style={{ color: "#000000" }}>
          Forgot Password
        </h3>

        {sent ? (
          <div className="text-center">
            <p className="text-success">
              ✅ Reset link sent! <br /> Check your email inbox.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="btn w-100"
              style={{
                backgroundColor: "#f15927",
                color: "white",
                fontWeight: 600,
              }}
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <div className="text-center mt-3">
          <a href="/login" style={{ color: "#000000" }}>
            Back to Login
          </a>
        </div>
      </div>
    </section>
  );
}
