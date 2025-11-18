"use client";

import React from "react";
import RegisterForm from "@/app/components/RegisterForm";
import LoginForm from "@/app/components/LoginForm";


export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl p-6 items-stretch">
        {/* Register Section */}
        <div className="flex flex-col justify-between items-center bg-white/95 rounded-xl shadow-lg p-6 hover:shadow-xl transition h-full">
          <div className="text-center mb-4">
            <h3 className="text-gray-500 text-sm">Don’t have an account?</h3>
            <h2 className="text-xl font-semibold text-indigo-700">Create Account</h2>
          </div>
          <div className="w-full flex-grow flex items-center">
            <RegisterForm />
          </div>
        </div>

        {/* Login Section */}
        <div className="flex flex-col justify-between items-center bg-white/95 rounded-xl shadow-lg p-6 hover:shadow-xl transition h-full">
          <div className="text-center mb-4">
            <h3 className="text-gray-500 text-sm">Already have an account?</h3>
            <h2 className="text-xl font-semibold text-indigo-700">Welcome Back</h2>
          </div>
          <div className="w-full flex-grow flex items-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
