"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationSuccessPage() {
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isLoginFlow, setIsLoginFlow] = useState(false);

  useEffect(() => {
    const savedPackage = localStorage.getItem("selectedPackage");
    const savedRegistration = localStorage.getItem("registrationData");
    const fromLogin = localStorage.getItem("emailVerifiedFromLogin");

    if (savedPackage) setPackageData(JSON.parse(savedPackage));
    if (savedRegistration) setRegistrationData(JSON.parse(savedRegistration));
    if (fromLogin) setIsLoginFlow(true);

    const timer = setTimeout(() => {
      if (fromLogin) {
        localStorage.removeItem("emailVerifiedFromLogin");
        router.push("/registerlogin");
      } else {
        router.push("/payment-requests");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          ✅ Email Verified Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          {isLoginFlow
            ? "Redirecting you to the login page..."
            : "Your email has been verified. Redirecting you to the payment page..."}
        </p>

        {!isLoginFlow && (
          <>
            {packageData && (
              <div className="mb-3">
                <p className="text-gray-800 font-semibold">
                  Selected Package: {packageData.packageName}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₹{packageData.price}
                </p>
              </div>
            )}
            {registrationData && (
              <div className="mb-3 text-sm text-gray-700">
                <p>Name: {registrationData.name}</p>
                <p>Email: {registrationData.email}</p>
              </div>
            )}
          </>
        )}

        <a
          href={isLoginFlow ? "/login" : "/payment-requests"}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          {isLoginFlow ? "Go to Login" : "Go to Payment Page"}
        </a>
      </div>
    </div>
  );
}
