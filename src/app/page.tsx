"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

interface Package {
  id: number;
  name: string;
  description: string;
  imageName?: string;
  points?: string[];
  pricing?: {
    rate?: number | string;
    discount?: number | string;
    finalPrice?: number | string;
    fromDate?: string;
    toDate?: string;
  };
}

export default function PackageListPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();

  // ------------------------------
  // Helper Functions
  // ------------------------------
  const getStatus = (fromDate?: string, toDate?: string) => {
    if (!fromDate || !toDate) return "Inactive";
    const now = new Date();
    const start = new Date(fromDate);
    const end = new Date(toDate);
    return now >= start && now <= end ? "Active" : "Inactive";
  };

  const formatPrice = (price?: number | string | null) => {
    if (price === null || price === undefined) return "0.00";
    const num = Number(price);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : "-");

  // ------------------------------
  // Fetch Packages
  // ------------------------------
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/admin-packages");
        setPackages(res.data);
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">🎁 Available Packages</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {packages.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No packages available.</p>
        ) : (
          packages.map((pkg) => {
            const imageUrl = pkg.imageName
              ? `http://localhost:3000/uploads/adminpackage/${pkg.imageName.replace(/\\/g, "/")}`
              : "/placeholder.png";

            // Read pricing directly
            const finalPrice = pkg.pricing?.finalPrice ?? pkg.pricing?.rate ?? 0;
            const originalRate = pkg.pricing?.rate ?? 0;
            const discountValue = pkg.pricing?.discount ?? 0;
            const status = getStatus(pkg.pricing?.fromDate, pkg.pricing?.toDate);

            return (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col">
                {/* Cover Image */}
                <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl">
                  <Image src={imageUrl} alt={pkg.name} fill className="object-cover" unoptimized />
                </div>

                {/* Status Badge */}
                <div className="flex justify-end mb-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status === "Active" ? "🟢 Active" : "🔴 Inactive"}
                  </span>
                </div>

                {/* Package Details */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name}</h2>
                <p className="text-gray-600 text-sm mb-3">
                  {pkg.description.length > 100 ? pkg.description.slice(0, 100) + "..." : pkg.description}
                </p>

                {/* Points */}
                {pkg.points && pkg.points.length > 0 && (
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm font-medium">Points: </span>
                    <ul className="list-disc list-inside text-gray-700 text-sm">
                      {pkg.points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Offer Dates */}
                <p className="text-sm text-gray-500 mb-1">
                  Offer valid from{" "}
                  <span className="font-medium text-gray-700">{formatDate(pkg.pricing?.fromDate)}</span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700">{formatDate(pkg.pricing?.toDate)}</span>
                </p>

                {/* Pricing */}
                <div className="flex items-center gap-2 mt-2 mb-4">
                  <span className="text-green-600 font-bold text-lg">₹{formatPrice(finalPrice)}</span>
                  {Number(discountValue) > 0 && (
                    <>
                      <span className="text-gray-400 line-through text-sm">₹{formatPrice(originalRate)}</span>
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-md">
                        {discountValue}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "selectedPackage",
                      JSON.stringify({ id: pkg.id, name: pkg.name, price: formatPrice(finalPrice) })
                    );
                    router.push("/registerlogin");
                  }}
                  className={`mt-auto w-full font-medium py-2 rounded-lg transition ${
                    status === "Active"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={status !== "Active"}
                >
                  {status === "Active" ? "Purchase" : "Unavailable"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
