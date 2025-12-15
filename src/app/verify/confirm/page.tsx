"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function VerifyConfirmPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensures code runs only on the client
  }, []);

  if (!mounted) return null; // prevent server-side rendering errors

  return <VerifyConfirmPageContent />;
}

function VerifyConfirmPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        router.push("/verify/success");
      } catch {
        router.push("/verify/failed");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-700 text-lg">Verifying your email, please wait...</p>
    </div>
  );
}





// "use client";
// export const dynamic = 'force-dynamic';
// import { useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import api from "@/utils/axiosInstance";

// export default function VerifyConfirmPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const token = searchParams.get("token");

//   useEffect(() => {
//     if (!token) return;
//     const verify = async () => {
//       try {
//         await api.get(`/auth/verify-email?token=${token}`);
//         router.push("/verify/success");
//       } catch {
//         router.push("/verify/failed");
//       }
//     };
//     verify();
//   }, [token, router]);

//   return <p>Verifying your email, please wait...</p>;
// }
