"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import api from "@/utils/axiosInstance";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);

  const [storedData, setStoredData] = useState<any>(null);

  useEffect(() => {
    const packageData = localStorage.getItem("selectedPackage");
    const registrationData = localStorage.getItem("registrationData");
    if (packageData || registrationData) {
      setStoredData({
        package: packageData ? JSON.parse(packageData) : null,
        registration: registrationData ? JSON.parse(registrationData) : null,
      });
    }
  }, []);

  // Auto verify if token is present (from email link)
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      setVerifying(true);
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        // If registration data exists → go to payment success
        if (localStorage.getItem("registrationData")) {
          router.push("/verification-success");
        } else {
          // Else → user came from login flow
          router.push("/verify/verification-success");
        }
      } catch (err: any) {
        alert("❌ Invalid or expired verification link");
      } finally {
        setVerifying(false);
      }
    };
    verifyEmail();
  }, [token, router]);

  // Resend email timer
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleResend = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/users/resend-email-verification",
        { email }
      );
      setMessage(res.data.message || "Verification email sent!");
      setTimer(30);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleOk = () => {
    // Keep data if registration flow
    if (storedData) {
      localStorage.setItem("selectedPackage", JSON.stringify(storedData.package));
      localStorage.setItem("registrationData", JSON.stringify(storedData.registration));
    }
    router.push("/verification-success");
  };

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-lg text-gray-700">
          Verifying your email, please wait...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-3">Email Verification</h2>

        <p className="text-gray-600 mb-5">
          We’ve sent a verification link to{" "}
          <span className="font-semibold">{email || "your email address"}</span>.
          Please check your inbox to verify your account.
        </p>

        <div className="flex flex-col gap-3 mb-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-4 py-2 w-full text-center"
            placeholder="Enter your email"
          />
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`${
              timer > 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } text-white px-4 py-2 rounded-md font-semibold transition`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Email"}
          </button>
        </div>

        <button
          onClick={handleOk}
          className="bg-green-600 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-green-700 transition"
        >
          OK
        </button>

        {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
      </div>
    </div>
  );
}
