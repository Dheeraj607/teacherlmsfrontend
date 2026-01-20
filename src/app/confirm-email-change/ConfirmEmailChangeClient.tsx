"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function ConfirmEmailChange() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const email = params.get("email");
  const [status, setStatus] = useState("Verifying your email...");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("❌ Invalid verification link.");
      return;
    }

    console.log("Confirming email change with:", { token, email });

    // Try the profile endpoint first
    api.post("/profile/confirm-otp", { token, email })
      .then(() => {
        setStatus("✅ Email verified successfully!");
        setVerified(true);

        // Update localStorage with new email
        if (email) {
          localStorage.setItem("teacherEmail", email);

          // Trigger storage event for sidebar to update
          window.dispatchEvent(new Event("storage"));
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => router.push("/dashboard"), 2000);
      })
      .catch((error) => {
        console.error("Email verification error:", error.response?.data || error.message);

        // Try alternative endpoint
        api.get(`/auth/verify-email-change?token=${token}&email=${email}`)
          .then(() => {
            setStatus("✅ Email verified successfully!");
            setVerified(true);

            if (email) {
              localStorage.setItem("teacherEmail", email);
              window.dispatchEvent(new Event("storage"));
            }

            setTimeout(() => router.push("/dashboard"), 2000);
          })
          .catch((err2) => {
            console.error("Alternative endpoint also failed:", err2.response?.data || err2.message);
            setStatus("❌ Email verification endpoint not found. Please contact support or manually update your email in settings.");
          });
      });
  }, [token, email, router]);

  const handleManualUpdate = () => {
    if (email) {
      localStorage.setItem("teacherEmail", email);
      window.dispatchEvent(new Event("storage"));
      setStatus("✅ Email updated in sidebar! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4">{status}</h2>

        {!verified && status.includes("not found") && email && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-3">
              If you've already verified your email through the link sent to you,
              click below to update your sidebar:
            </p>
            <button
              onClick={handleManualUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Sidebar with New Email
            </button>
          </div>
        )}

        {verified && (
          <p className="text-sm text-gray-600 mt-2">
            Redirecting to dashboard...
          </p>
        )}
      </div>
    </div>
  );
}
