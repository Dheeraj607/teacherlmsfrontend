"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export default function OtpPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Get user data from localStorage on mount
  useEffect(() => {
    const storedPhone = localStorage.getItem("pendingPhone");
    const storedEmail = localStorage.getItem("pendingEmail");

    if (!storedPhone || !storedEmail) {
      toast.error("Missing verification data. Please login again.");
      router.push("/registerlogin");
      return;
    }

    setPhone(storedPhone);
    setEmail(storedEmail);
    sendOtp(storedPhone);
  }, [router]);

  // ✅ Send OTP
  const sendOtp = async (phoneNumber: string) => {
    try {
      await api.post("/auth/send-otp", { phone: phoneNumber });
      toast.success("OTP sent to your phone.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otp });
      toast.success("Phone verified successfully!");

      // ✅ Make sure pendingEmail exists
      if (!email) {
        const regData = JSON.parse(localStorage.getItem("registrationData") || "{}");
        if (regData.email) {
          localStorage.setItem("pendingEmail", regData.email);
        }
      }

      // ✅ Redirect to email verification
      router.push("/verify-email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📱 Verify Your Phone
        </h2>

        {phone ? (
          <p className="text-gray-600 mb-3">
            We’ve sent an OTP to <strong>{phone}</strong>
          </p>
        ) : (
          <p className="text-red-500 mb-3">Fetching phone number...</p>
        )}

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full text-center tracking-widest text-lg font-semibold p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className={`w-full py-2 text-white rounded-md font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 transition-all"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={() => sendOtp(phone)}
          disabled={!phone}
          className="mt-4 text-sm text-indigo-600 hover:underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
