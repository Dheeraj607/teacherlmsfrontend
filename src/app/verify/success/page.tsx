"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerificationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/registerlogin");
    }, 3000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-green-600 mb-3">
          🎉 Email Verified Successfully!
        </h2>
        <p className="text-gray-600">You can now log in to your account.</p>
        <p className="text-sm text-gray-400 mt-3">Redirecting to login...</p>
      </div>
    </div>
  );
}
