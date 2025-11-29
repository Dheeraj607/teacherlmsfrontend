"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<{ id: number; name: string; price: number } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      ...formData,
      packageId: selectedPackage?.id || null,   // ✅ Send packageId to backend
    });
 const teacherAdminPackageId = response.data.teacherAdminPackageId;

// Save teacherAdminPackageId locally
localStorage.setItem("teacherAdminPackageId", teacherAdminPackageId);
    const phone = formData.phone;

    // Store locally for OTP usage
localStorage.setItem(
  "registrationData",
  JSON.stringify({
    ...formData,

    selectedPackage: {
      id: selectedPackage?.id,
      name: selectedPackage?.name,
      price: selectedPackage?.price, // ✅ IMPORTANT
    },

    teacherAdminPackage: {
      id: teacherAdminPackageId,
    },
  })
);

    localStorage.setItem(
      "pendingUser",
      JSON.stringify({
        email: formData.email,
        phone: formData.phone,
      })
    );

    setMessage({ type: "success", text: "✅ Registration successful! Redirecting..." });

    setTimeout(() => {
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    }, 1500);
  } catch (error: any) {
    console.error(error);
    setMessage({
      type: "error",
      text: error.response?.data?.message || "❌ Registration failed",
    });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const storedPackage = localStorage.getItem("selectedPackage");
  if (storedPackage) {
    setSelectedPackage(JSON.parse(storedPackage));
  }
}, []);


  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* <h2 className="text-2xl font-bold text-center">Register</h2>
      {selectedPackage && (
  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md text-center mb-2">
    <p className="text-sm text-indigo-700 font-medium">
      You’re purchasing: <strong>{selectedPackage.name}</strong> for ₹{selectedPackage.price}
    </p>
  </div>
)} */}

      {message && (
        <div
          className={`p-2 rounded text-center text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

<div className="mb-4">
  <input
    type="text"
    name="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-white rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300"
  />
</div>

<div className="flex flex-col gap-4">
  <input
    type="text"
    name="username"
    placeholder="Username"
    value={formData.username}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-white rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300"
  />

  <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-white rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300"
  />

  <input
    type="text"
    name="phone"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-white rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300"
  />

  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-white rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300"
  />

  <input
    type="date"
    name="dob"
    value={formData.dob}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border border-white rounded-md bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300"
  />
</div>


     <button
  type="submit"
  disabled={loading}
  className="w-full bg-white text-black py-2 rounded-md hover:bg-gray-200 disabled:opacity-60"
>
  {loading ? "Registering..." : "Register"}
</button>

    </form>
  );
}