"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import VerifyOtpForm from "@/app/components/VerifyOtpForm";

export default function VerifyOtpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // now we are on client
  }, []);

  if (!mounted) return null; // don't render on server

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <VerifyOtpForm />
    </div>
  );
}







// "use client";
// export const dynamic = 'force-dynamic';

// import VerifyOtpForm from "@/app/components/VerifyOtpForm";

// export default function VerifyOtpPage() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <VerifyOtpForm />
//     </div>
//   );
// }
