"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Replace history so back button goes to home page
    window.history.replaceState({}, "", "/");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Logout Successful</h1>
      <p className="text-gray-700">
        You have been logged out successfully. Click below to go to the home page.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => router.push("/")}
      >
        Go to Home
      </button>
    </div>
  );
}
