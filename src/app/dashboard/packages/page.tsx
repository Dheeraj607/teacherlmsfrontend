"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";

interface Package {
  id: number;
  name: string;
  description: string;
  coverImage?: string;
  paymentSettings?: {
    price: number;
    currency: string;
  };
}

export default function PackageListPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageOpen, setPackageOpen] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data || []);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.delete(`/packages/${id}`);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Package List</h2>
        <button
          onClick={() => router.push("/dashboard/packages/create")}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
        >
          ➕ Create Package
        </button>
      </div>

      {packages.length === 0 ? (
        <p className="text-gray-500 text-lg">No packages found.</p>
      ) : (
        <div className="flex flex-wrap -mx-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="w-full sm:w-1/2 md:w-1/3 px-3"
            >
              <div className="card border rounded-lg shadow-md flex flex-col overflow-hidden h-100">
                {/* Cover Image */}
                <div className="w-full h-40 overflow-hidden bg-gray-100 rounded-t-lg">
                  <img
                    src={pkg.coverImage || "/placeholder.png"}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h5 className="text-lg font-semibold text-gray-800 mb-2">
                    {pkg.name}
                  </h5>

                  {/* View Details Accordion */}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      className="flex items-center justify-between w-full px-0 py-1 text-sm font-medium text-gray-700 hover:underline"
                      onClick={() =>
                        setPackageOpen((prev) => ({
                          ...prev,
                          [pkg.id]: !prev[pkg.id],
                        }))
                      }
                    >
                      <span>{packageOpen[pkg.id] ? "Hide Details" : "View Details"}</span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                          packageOpen[pkg.id] ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {packageOpen[pkg.id] && (
                      <div className="mt-2 text-gray-700 text-sm">
                        {/* Full Description */}
                        <div
                          className="ck-content mb-3 text-gray-700 text-sm"
                          dangerouslySetInnerHTML={{ __html: pkg.description || "" }}
                        />

                        {/* Price */}
                        <p className="text-lg font-bold text-gray-800">
                          {pkg.paymentSettings?.currency || "₹"}{" "}
                          {pkg.paymentSettings?.price || 0}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/packages/edit/${pkg.id}`)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/package-settings/${pkg.id}`)}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/package-payment-settings/${pkg.id}`)
                      }
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




// "use client";

// import { useEffect, useState } from "react";
// import api from "@/app/lib/api";
// import { useRouter } from "next/navigation";

// interface Package {
//   id: number;
//   name: string;
//   description: string;
//   coverImage?: string;
//   sellingPrice: number;
//   currency: string;
//   paymentSettings?: {
//     price: number;
//     currency: string;
//   };
// }


// export default function PackageListPage() {
//   const [packages, setPackages] = useState<Package[]>([]);
//   const router = useRouter();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000"
//   useEffect(() => {
//     fetchPackages();
//   }, []);
// const fetchPackages = async () => {
//   try {
//     const res = await api.get("/packages"); // existing endpoint
//     const packagesWithPrice = res.data.map((pkg: any) => ({
//       ...pkg,
//       sellingPrice: pkg.paymentSettings?.price || 0,
//       currency: pkg.paymentSettings?.currency || '₹',
//     }));
//     setPackages(packagesWithPrice);
//     console.log("packages", packagesWithPrice);
//   } catch (err) {
//     console.error("Error fetching packages:", err);
//   }
// };



//   const handleDelete = async (id: number) => {
//     if (confirm("Are you sure you want to delete this package?")) {
//       await api.delete(`/packages/${id}`);
//       fetchPackages();
//     }
//   };

//   return (
//     <div className="p-6 font-sans">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-3xl font-bold text-gray-800 flex items-center">
//           Package List
//         </h2>
//         <button
//           onClick={() => router.push("/dashboard/packages/create")}
//           className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
//         >
//           ➕ Create Package
//         </button>
//       </div>

//       {packages.length === 0 ? (
//         <p className="text-gray-500 text-lg">No packages found.</p>
//       ) : (
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//   {packages.map((pkg) => (
//     <div
//       key={pkg.id}
//       className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition"
//     >
//       {/* Cover Image */}
//       <div className="w-full h-60 bg-gray-100 flex-shrink-0">
// <img
//   src={pkg.coverImage || "/placeholder.png"}
//   alt={pkg.name}
//   className="w-full h-full object-cover"
// />



//       </div>

//       {/* Content */}
//       <div className="p-5 flex flex-col flex-grow">
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">
//           {pkg.name}
//         </h3>

//         {/* Description */}
// <div
//   className="ck-content text-gray-700 text-sm mb-4 max-h-20 overflow-hidden"
//   dangerouslySetInnerHTML={{ __html: pkg.description || "" }}
// />





//         {/* Price */}
//         <p className="text-lg font-bold text-gray-800 mb-4">
//           {pkg.currency || '₹'} {pkg.sellingPrice}
//         </p>

//         {/* Actions */}
//         <div className="grid grid-cols-2 gap-2 mt-auto">
//           <button
//             onClick={() =>
//               router.push(`/dashboard/packages/edit/${pkg.id}`)
//             }
//             className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => handleDelete(pkg.id)}
//             className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() =>
//               router.push(`/dashboard/package-settings/${pkg.id}`)
//             }
//             className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
//           >
//             Settings
//           </button>
//           <button
//             onClick={() =>
//               router.push(`/dashboard/package-payment-settings/${pkg.id}`)
//             }
//             className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
//           >
//             Payment
//           </button>
//         </div>
//       </div>
//     </div>
//   ))}
// </div>

//       )}
//     </div>
//   );
// }
