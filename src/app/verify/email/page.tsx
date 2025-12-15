"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ensures code runs only on client
  }, []);

  if (!mounted) return null; // prevents server-side access to client-only hooks

  return <VerifyEmailPageContent />;
}

// Separate component with the existing logic
function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);

  // Auto verify when token exists
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      setVerifying(true);
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        toast.success("✅ Email verified successfully!");

        if (localStorage.getItem("registrationData")) {
          router.push("/verification-success");
        } else {
          router.push("/dashboard");
        }
      } catch (err: any) {
        toast.error("❌ Invalid or expired verification link");
      } finally {
        setVerifying(false);
      }
    };
    verifyEmail();
  }, [token, router]);

  // Resend email timer
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleResend = async () => {
    if (!email) return setMessage("Please enter a valid email.");
    try {
      const res = await api.post("/auth/resend-email-verification", { email });
      toast.success(res.data.message || "Verification email sent!");
      setTimer(30);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-lg text-gray-700">
          Verifying your email, please wait...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-3">Email Verification</h2>

        <p className="text-gray-600 mb-5">
          We’ve sent a verification link to{" "}
          <span className="font-semibold">{email || "your email address"}</span>.
          Please check your inbox to verify your account.
        </p>

        <div className="flex flex-col gap-3 mb-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-4 py-2 w-full text-center"
            placeholder="Enter your email"
          />
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`${
              timer > 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            } text-white px-4 py-2 rounded-md font-semibold transition`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Email"}
          </button>
        </div>

        {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
      </div>
    </div>
  );
}











// "use client";
// export const dynamic = 'force-dynamic';

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import api from "@/utils/axiosInstance";
// import { toast } from "react-toastify";

// export default function VerifyEmailPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");
//   const initialEmail = searchParams.get("email") || "";

//   const [email, setEmail] = useState(initialEmail);
//   const [message, setMessage] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [verifying, setVerifying] = useState(false);

//   useEffect(() => {
//     // ✅ Auto verify when link contains token
//     const verifyEmail = async () => {
//       if (!token) return;
//       setVerifying(true);
//       try {
//         const res = await api.get(`/auth/verify-email?token=${token}`);
//         toast.success("✅ Email verified successfully!");

//         // 🔹 If user was registering → go to registration success
//         if (localStorage.getItem("registrationData")) {
//           router.push("/verification-success");
//         } else {
//           // 🔹 If user logged in → go to dashboard
//           router.push("/dashboard");
//         }
//       } catch (err: any) {
//         toast.error("❌ Invalid or expired verification link");
//       } finally {
//         setVerifying(false);
//       }
//     };
//     verifyEmail();
//   }, [token, router]);

//   // ⏱️ Resend email timer
//   useEffect(() => {
//     if (timer > 0) {
//       const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [timer]);

//   // 🔁 Resend verification email
//   const handleResend = async () => {
//     if (!email) return setMessage("Please enter a valid email.");

//     try {
//       const res = await api.post("/auth/resend-email-verification", { email });
//       toast.success(res.data.message || "Verification email sent!");
//       setTimer(30);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   if (verifying) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center text-lg text-gray-700">
//           Verifying your email, please wait...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-3">Email Verification</h2>

//         <p className="text-gray-600 mb-5">
//           We’ve sent a verification link to{" "}
//           <span className="font-semibold">{email || "your email address"}</span>.
//           Please check your inbox to verify your account.
//         </p>

//         <div className="flex flex-col gap-3 mb-5">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border rounded-md px-4 py-2 w-full text-center"
//             placeholder="Enter your email"
//           />
//           <button
//             onClick={handleResend}
//             disabled={timer > 0}
//             className={`${
//               timer > 0
//                 ? "bg-gray-300 cursor-not-allowed"
//                 : "bg-black hover:bg-gray-800"
//             } text-white px-4 py-2 rounded-md font-semibold transition`}
//           >
//             {timer > 0 ? `Resend in ${timer}s` : "Resend Email"}
//           </button>
//         </div>

//         {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
//       </div>
//     </div>
//   );
// }
