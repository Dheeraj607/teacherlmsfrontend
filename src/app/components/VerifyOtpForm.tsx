"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // ✅ Added email state
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const router = useRouter();

  // ✅ Pre-fill phone and email from URL params
  useEffect(() => {
    const phoneFromUrl = searchParams.get("phone");
    const emailFromUrl = searchParams.get("email");
    if (phoneFromUrl) setPhone(phoneFromUrl);
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [searchParams]);

  // ✅ Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);
  // ✅ Load registration data from localStorage
useEffect(() => {
  const storedPackage = localStorage.getItem("selectedPackage");
  if (storedPackage) {
    const parsed = JSON.parse(storedPackage);
    console.log("Selected Package:", parsed); // ✅ you can view it in console
  }
}, []);


  // ✅ Update phone if changed
  const handleUpdatePhone = async () => {
    const oldPhone = searchParams.get("phone");
    if (!oldPhone || oldPhone === phone) return;

    try {
      await axios.post("http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/users/update-phone", {
        oldPhone,
        newPhone: phone,
      });
      alert("✅ Phone number updated successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "❌ Failed to update phone number");
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await handleUpdatePhone();

    const res = await axios.post("http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/users/verify-otp", {
      phone,
      otp,
    });

    alert(res.data.message || "✅ OTP verified successfully!");

    // ✅ Get verified email
    const verifiedEmail = res.data.email || email || "";

    // ✅ Retrieve package ID from localStorage
    const storedPackageId = localStorage.getItem("selectedPackageId");

    // ✅ Redirect to verify email page with email + packageId
    if (storedPackageId) {
      router.push(
        `/verify-email?email=${encodeURIComponent(
          verifiedEmail
        )}&packageId=${storedPackageId}`
      );
    } else {
      router.push(`/verify-email?email=${encodeURIComponent(verifiedEmail)}`);
    }
  } catch (error: any) {
    alert(error.response?.data?.message || "❌ OTP verification failed.");
  } finally {
    setLoading(false);
  }
};


  // ✅ Resend OTP logic
  const handleResendOtp = async () => {
    try {
      await axios.post("http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/users/resend-otp", { phone });
      alert("✅ OTP resent successfully!");
      setTimer(120);
    } catch (error: any) {
      alert(error.response?.data?.message || "❌ Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>

        {/* Phone Number Field */}
        <div className="text-left mb-4">
          <label className="block text-sm font-semibold mb-1">
            Phone Number
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {/* OTP Field */}
        <div className="text-left mb-4">
          <label className="block text-sm font-semibold mb-1">Enter OTP</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Timer / Resend */}
        <div className="mt-4 text-sm text-gray-600">
          {timer > 0 ? (
            <p>
              Resend OTP in{" "}
              <span className="font-semibold">{timer}</span> seconds
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 hover:underline font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
