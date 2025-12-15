"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PackageForm = dynamic(() => import("@/app/components/PackageForm"), { ssr: false });

export default function CreatePackagePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="p-6 font-sans">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">Create Package</h2>

      <PackageForm
        onSuccess={() => {
          router.push("/dashboard/packages");
        }}
      />
    </div>
  );
}






// "use client";

// import PackageForm from "@/app/components/PackageForm";
// import { useRouter } from "next/navigation";

// export default function CreatePackagePage() {
//   const router = useRouter();

//   return (
//     <div className="p-6 font-sans">
//       <h2 className="text-3xl font-bold mb-10 text-gray-800">
//          Create Package
//       </h2>

//       <PackageForm
//         onSuccess={() => {
//           return router.push("/dashboard/packages");
//         }}
//       />
//     </div>
//   );
// }
