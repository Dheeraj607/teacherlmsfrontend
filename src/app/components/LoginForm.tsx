"use client";

import React, { useState } from "react";
import api from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation"; // ✅ correct import

export default function LoginForm() {
  const router = useRouter(); // ✅ define router here
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      console.log("🟢 Login response:", data);

      if (data.status === "PHONE_NOT_VERIFIED") {
        localStorage.setItem("pendingPhone", data.phone);
        localStorage.setItem("pendingEmail", email);
        router.push("/verify/otp"); // ✅ safe to use now
      } else if (data.status === "EMAIL_NOT_VERIFIED") {
        localStorage.setItem("pendingEmail", data.email);
        router.push("/verify/email"); // ✅ safe to use now
      } else if (data.status === "SUCCESS") {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        toast.success("Login successful!");
        window.location.href = "/dashboard"; // ✅ or router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("❌ Login failed:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
