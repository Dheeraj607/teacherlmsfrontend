"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PackageForm = dynamic(() => import("@/app/components/PackageForm"), { ssr: false });

export default function CreatePackagePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Push a dummy history entry so back button works
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      router.push("/dashboard/packages"); // fallback if no previous page
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="p-6 font-sans">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">Create Package</h2>

      <PackageForm
        onSuccess={() => router.push("/dashboard/packages")}
        onCancel={() => router.push("/dashboard/packages")}
      />
    </div>
  );
}





// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation";

// const PackageForm = dynamic(() => import("@/app/components/PackageForm"), { ssr: false });

// export default function CreatePackagePage() {
//   const router = useRouter();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null;

//   return (
//     <div className="p-6 font-sans">
//       <h2 className="text-3xl font-bold mb-10 text-gray-800">Create Package</h2>

//   <PackageForm
//   onSuccess={() => router.push("/dashboard/packages")}
//   onCancel={() => router.push("/dashboard/packages")}
// />

//     </div>
//   );
// }




