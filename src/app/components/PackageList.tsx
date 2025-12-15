"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";

interface Package {
  id: number;
  name: string;
  description: string;
  sellingPrice: number;
  coverImage?: string;
}

export default function PackageList() {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000"

  useEffect(() => {
    fetchPackages();
  }, []);

  // const fetchPackages = async () => {
  //   const res = await api.get("/packages");
  //   setPackages(res.data);
    
  //         console.log("pakages",res.data)

  // };
  const fetchPackages = async () => {
  try {
    const res = await api.get("/packages");
    console.log("pakages", res.data);
    setPackages(res.data);
  } catch (error) {
    console.error("Error fetching packages:", error);
  }
};


  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this package?")) {
      await api.delete(`/packages/${id}`);
      fetchPackages();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
        📦 Package List
      </h2>

      {packages.length === 0 ? (
        <p className="text-gray-500 text-lg">No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            
            
            <div
              key={pkg.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative w-full h-48 bg-gray-100">
<img
  src={pkg.coverImage ? `${API_BASE_URL}${pkg.coverImage}` : "/placeholder.png"}
  
  
  alt={pkg.name}
  className="w-full h-full object-cover"
/>








              </div>
              

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {pkg.description}
                </p>
                <p className="text-lg font-bold text-purple-600 mb-4">
                  ₹ {pkg.sellingPrice}
                </p>

                {/* Actions - Grid layout ensures visibility */}
                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/packages/edit/${pkg.id}`)
                    }
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
<button
  onClick={() => router.push(`/dashboard/package-settings/${pkg.id}`)}
  className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
>
  ⚙️ Settings
</button>

                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/package-payment-settings/${pkg.id}`
                      )
                    }
                    className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition"
                  >
                    💳 Payment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
