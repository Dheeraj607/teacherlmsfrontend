"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

interface Package {
  id: number;
  name: string;
  description: string;
  status: string;
  imageName?: string;
  points?: string[];
  pricing?: {
    rate?: number | string;
    discount?: number | string;
    specialPrice?: number | string;
    finalPrice?: number | string;
    fromDate?: string;
    toDate?: string;
  };
}

export default function PackageListPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const router = useRouter();

  const getStatus = (backendStatus: string, fromDate?: string | null, toDate?: string | null) => {
    if (backendStatus.toLowerCase() !== "active") return "Inactive";
    if (!fromDate && !toDate) return "Active";
    if (!fromDate || !toDate) return "Inactive";

    const now = new Date();
    const start = new Date(fromDate);
    const end = new Date(toDate);

    return now >= start && now <= end ? "Active" : "Inactive";
  };

  const formatPrice = (price?: number | string | null) => {
    if (price === null || price === undefined) return "0";
    const num = Number(price);
    if (isNaN(num)) return "0";
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : "-");

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
    <div
      className="min-h-screen flex flex-col items-center pb-10 font-sans"
      style={{ background: 'linear-gradient(to bottom, #13e5da 0%, #464cc8 50%, #9428cc 100%)' }}
    >
      {/* Header: Logo, Heading, Login Button */}
      <div className="w-full max-w-9xl px-6 flex items-center justify-between mt-4 mb-8">
        {/* Logo */}
       <div className="w-40 h-24 relative">
  <Image
    src="/images/logo.jpg"
    alt="Logo"
    fill
    className="object-contain"
  />
</div>

        {/* Heading */}
          <h1 className="text-8xl font-extrabold text-black text-center absolute left-1/2 transform -translate-x-1/2">
    Packages
  </h1>

        {/* Login Button */}
        <button
          onClick={() => router.push("/login")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition "
        >
          Login
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-9xl px-6">
        {packages.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No packages available.</p>
        ) : (
          packages.map((pkg) => {
            const imageUrl = pkg.imageName
              ? `http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000/uploads/adminpackage/${pkg.imageName.replace(/\\/g, "/")}`
              : "/placeholder.png";

            const originalRate = Number(pkg.pricing?.rate ?? 0);
            const discount = Number(pkg.pricing?.discount ?? 0);
            const specialPriceRaw = pkg.pricing?.specialPrice;

            const specialPrice = specialPriceRaw !== undefined && specialPriceRaw !== null
              ? Number(specialPriceRaw)
              : null;

            const finalPrice = specialPrice !== null
              ? specialPrice
              : discount > 0
                ? +(originalRate - (originalRate * discount)/100).toFixed(2)
                : originalRate;

            const showStrikeThrough = (discount > 0 || (specialPrice !== null && specialPrice < originalRate));
            const showOfferDates = discount > 0 || (specialPrice !== null);
            const status = getStatus(pkg.status, pkg.pricing?.fromDate, pkg.pricing?.toDate);

            return (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
                {/* Cover Image */}
                <div className="relative w-full h-72 mb-4 overflow-hidden rounded-xl">
                  <Image src={imageUrl} alt={pkg.name} fill className="object-cover" unoptimized />
                </div>

                {/* Package Name */}
                <h2 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h2>

                {/* Price */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-bold text-black-10">₹{formatPrice(finalPrice)}</span>
                  {showStrikeThrough && (
                    <span className="text-gray-400 line-through text-2xl">₹{formatPrice(originalRate)}</span>
                  )}
                  {discount > 0 && specialPrice === null && (
                    <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-md">{discount}% OFF</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                {/* Purchase Button */}
                <button
                  onClick={() => {
                    localStorage.removeItem("selectedPackage");
                    localStorage.setItem(
                      "selectedPackage",
                      JSON.stringify({ id: pkg.id, name: pkg.name, price: formatPrice(finalPrice) })
                    );
                    router.push("/registerlogin");
                  }}
                  className={`btn btn-primary mb-4 transition ${
                    status === "Active"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={status !== "Active"}
                >
                  {status === "Active" ? "Purchase" : "Unavailable"}
                </button>

                {/* Offer Dates */}
                {showOfferDates && (pkg.pricing?.fromDate || pkg.pricing?.toDate) && (
                  <p className="!text-red-600 font-medium text-sm mb-2">
                    Offer valid from {formatDate(pkg.pricing?.fromDate)} to {formatDate(pkg.pricing?.toDate)}
                  </p>
                )}

                {/* Points */}
               {pkg.points && pkg.points.length > 0 && (
  <ul className="text-gray-700 text-sm mb-3 space-y-2">
    {pkg.points.map((p, idx) => (
      <li key={idx} className="flex items-start gap-2">
        <span className="text-indigo-600 text-lg leading-5">›</span>
        <span>{p}</span>
      </li>
    ))}
  </ul>
)}


              </div>
            );
          })
        )}
      </div>
    </div>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import api from "@/utils/axiosInstance";

// interface Package {
//   id: number;
//   name: string;
//   description: string;
//     status: string; 
//   imageName?: string;
//   points?: string[];
//   pricing?: {
//     rate?: number | string;
//     discount?: number | string;
//      specialPrice?: number | string; 
//     finalPrice?: number | string;
//     fromDate?: string;
//     toDate?: string;
//     settings?: {
//       discount?: number | string;
//       finalPrice?: number | string;
//       fromDate?: string;
//       toDate?: string;
//     };
//   };
// }

// export default function PackageListPage() {
//   const [packages, setPackages] = useState<Package[]>([]);
//   const router = useRouter();

//   // ------------------------------
//   // Helper Functions
//   // ------------------------------
// const getStatus = (
//   backendStatus: string, 
//   fromDate?: string | null, 
//   toDate?: string | null
// ) => {
//   // If backend says inactive, always return Inactive
//   if (backendStatus.toLowerCase() !== "active") return "Inactive";

//   // If both dates are missing, treat as Active
//   if (!fromDate && !toDate) return "Active";

//   // If only one date exists, treat as Inactive
//   if (!fromDate || !toDate) return "Inactive";

//   const now = new Date();
//   const start = new Date(fromDate);
//   const end = new Date(toDate);

//   return now >= start && now <= end ? "Active" : "Inactive";
// };


//   const formatPrice = (price?: number | string | null) => {
//     if (price === null || price === undefined) return "0.00";
//     const num = Number(price);
//     if (isNaN(num)) return "0.00";
//     return num.toFixed(2);
//   };

//   const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : "-");

//   // ------------------------------
//   // Fetch Packages
//   // ------------------------------
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const res = await api.get("/admin-packages");
//         setPackages(res.data);
//       } catch (err) {
//         console.error("Error fetching packages:", err);
//       }
//     };
//     fetchPackages();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">Available Packages</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
//         {packages.length === 0 ? (
//           <p className="text-gray-500 text-center col-span-full">No packages available.</p>
//         ) : (
//           packages.map((pkg) => {
//             const imageUrl = pkg.imageName
//               ? `http://localhost:3000/uploads/adminpackage/${pkg.imageName.replace(/\\/g, "/")}`
//               : "/placeholder.png";

//             // Read pricing directly
// const originalRate = Number(pkg.pricing?.rate ?? 0);
// const finalPrice = Number(pkg.pricing?.settings?.finalPrice ?? originalRate);
// const discountValue = Number(pkg.pricing?.settings?.discount ?? 0);

// // Determine if there is a discount or special price
// const hasOffer = discountValue > 0 || finalPrice < originalRate;



// const status = getStatus(
//   pkg.status, 
//   pkg.pricing?.settings?.fromDate, 
//   pkg.pricing?.settings?.toDate
// );


//             return (
//               <div key={pkg.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col">
//                 {/* Cover Image */}
//                 <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl">
//                   <Image src={imageUrl} alt={pkg.name} fill className="object-cover" unoptimized />
//                 </div>

//                 {/* Status Badge */}
//                 <div className="flex justify-end mb-2">
//                   <span
//                     className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                       status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {status === "Active" ? "🟢 Active" : "🔴 Inactive"}
//                   </span>
//                 </div>

//                 {/* Package Details */}
//                 <h2 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name}</h2>
//                 <p className="text-gray-600 text-sm mb-3">
//                   {pkg.description.length > 100 ? pkg.description.slice(0, 100) + "..." : pkg.description}
//                 </p>

//                 {/* Points */}
//                 {pkg.points && pkg.points.length > 0 && (
//                   <div className="mb-2">
//                     <span className="text-gray-600 text-sm font-medium">Points: </span>
//                     <ul className="list-disc list-inside text-gray-700 text-sm">
//                       {pkg.points.map((p, idx) => (
//                         <li key={idx}>{p}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Offer Dates */}
//             {/* Offer Dates (only if discounted or special price) */}
// {hasOffer && (pkg.pricing?.fromDate || pkg.pricing?.toDate) && (
//   <p className="text-sm text-gray-500 mb-1">
//     Offer valid from{" "}
//     <span className="font-medium text-gray-700">{formatDate(pkg.pricing?.fromDate)}</span>{" "}
//     to{" "}
//     <span className="font-medium text-gray-700">{formatDate(pkg.pricing?.toDate)}</span>
//   </p>
// )}



//                 {/* Pricing */}
//                 <div className="flex items-center gap-2 mt-2 mb-4">
//                   <span className="text-green-600 font-bold text-lg">₹{formatPrice(finalPrice)}</span>
//                   {Number(discountValue) > 0 && (
//                     <>
//                       <span className="text-gray-400 line-through text-sm">₹{formatPrice(originalRate)}</span>
//                       <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-md">
//                         {discountValue}% OFF
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 {/* Purchase Button */}
//                 <button
//                   onClick={() => {
//                     localStorage.setItem(
//                       "selectedPackage",
//                       JSON.stringify({ id: pkg.id, name: pkg.name, price: formatPrice(finalPrice) })
//                     );
//                     router.push("/registerlogin");
//                   }}
//                   className={`mt-auto w-full font-medium py-2 rounded-lg transition ${
//                     status === "Active"
//                       ? "bg-blue-600 hover:bg-blue-700 text-white"
//                       : "bg-gray-400 text-gray-200 cursor-not-allowed"
//                   }`}
//                   disabled={status !== "Active"}
//                 >
//                   {status === "Active" ? "Purchase" : "Unavailable"}
//                 </button>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

