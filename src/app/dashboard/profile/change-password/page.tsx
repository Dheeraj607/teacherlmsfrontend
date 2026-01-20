"use client";

import { useState } from "react";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const userId = typeof window !== "undefined" ? localStorage.getItem("teacherId") : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/profile/change-password", {
                userId,
                oldPassword: form.currentPassword,
                newPassword: form.newPassword,
            });

            setMessage(res.data.message || "Password updated successfully!");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

            // Redirect after success
            setTimeout(() => router.push("/dashboard/profile"), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Change Password</h2>
                <button
                    onClick={() => router.push("/dashboard/profile")}
                    className="text-gray-500 hover:text-gray-800"
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                        required
                        placeholder="Enter current password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                        required
                        placeholder="Enter new password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded"
                        required
                        placeholder="Confirm new password"
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded text-white font-semibold transition ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}
