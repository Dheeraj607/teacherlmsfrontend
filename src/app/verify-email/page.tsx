import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export const dynamic = "force-dynamic"; // Optional – keep if you want full dynamic rendering
// You can remove the line above if you prefer static shell + streaming

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center text-lg text-gray-700">
            Loading verification page...
          </div>
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}




// "use client";
// export const dynamic = 'force-dynamic';

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ??
//   "https://d1ojm6zdv3m37g.cloudfront.net";


// export default function VerifyEmailPage() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null; // prevent server-side rendering

//   return <VerifyEmailContent />;
// }

// function VerifyEmailContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [verifying, setVerifying] = useState(false);

//   // Save enrollment automatically once
//   useEffect(() => {
//     try {
//       const registrationData = localStorage.getItem("registrationData");
//       if (!registrationData) {
//         const initialEmail = searchParams.get("email");
//         if (initialEmail) setEmail(initialEmail);
//         return;
//       }

//       const parsed = JSON.parse(registrationData);
//       if (parsed.email) setEmail(parsed.email);

//       // Auto-save logic here (optional)
//       // ...
//     } catch (err) {
//       console.error(err);
//     }
//   }, [searchParams]);

//   // Auto verify email
//   useEffect(() => {
//     if (!token) return;

//     const verifyEmail = async () => {
//       setVerifying(true);
//       try {
//         await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
//         router.push("/verification-success");
//       } catch (err) {
//         console.error(err);
//         alert("❌ Invalid or expired verification link");
//       } finally {
//         setVerifying(false);
//       }
//     };

//     verifyEmail();
//   }, [token, router]);

//   // Resend timer
//   useEffect(() => {
//     if (timer > 0) {
//       const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [timer]);

//   const handleResend = async () => {
//     if (!email) return setMessage("Please enter a valid email.");

//     try {
//       const res = await axios.post(`${API_URL}/users/resend-email-verification`, { email });
//       setMessage(res.data.message || "Verification email sent!");
//       setTimer(30);
//     } catch (err: any) {
//       setMessage(err.response?.data?.message || "Something went wrong");
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
//           We’ve sent a verification link to <span className="font-semibold">{email || "your email address"}</span>.
//           Please check your inbox to verify your account.
//         </p>

//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border rounded-md px-4 py-2 w-full text-center mb-3"
//           placeholder="Enter your email"
//         />
//         <button
//           onClick={handleResend}
//           disabled={timer > 0}
//           className={`${
//             timer > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"
//           } text-white px-4 py-2 rounded-md font-semibold transition w-full mb-3`}
//         >
//           {timer > 0 ? `Resend in ${timer}s` : "Resend Email"}
//         </button>

//         {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
//       </div>
//     </div>
//   );
// }












// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import axios from "axios";
// import api from "@/utils/axiosInstance";

// export default function VerifyEmailPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [verifying, setVerifying] = useState(false);
//   const hasSaved = useRef(false); // prevents double save

//   // Fetch stored registration data
//   useEffect(() => {
//     const registrationData = localStorage.getItem("registrationData");
//     if (registrationData) {
//       const parsedData = JSON.parse(registrationData);
//       if (parsedData.email) {
//         setEmail(parsedData.email); // Pre-fill with teacher's email
//       }

//       //✅ Save enrollment automatically after email verification
//       if (!hasSaved.current) {
//         hasSaved.current = true;

//         const payload = {
//           teacher: {
//             id: parsedData.id,
//             teacherAdminPackageId: parsedData.teacherAdminPackage?.id || null,
//             name: parsedData.name || "",
//             email: parsedData.email || "",
//             phone: parsedData.phone || "",
//             dob: parsedData.dob || "",
//           },
//           admin: parsedData.admin || null,
//           domain: parsedData.domain || null,
//      selectedPackage: parsedData.selectedPackage
//   ? {
//       id: parsedData.selectedPackage.id,
//       name: parsedData.selectedPackage.name,
//       price: parsedData.selectedPackage.price,  // ✅ REQUIRED
//       finalPrice: parsedData.selectedPackage.finalPrice || null,
//       description: parsedData.selectedPackage.description || null,
//     }
//   : null,

//         };

//         axios
//           .post("http://localhost:3000/teacher-enrollment/save", payload)
//           .then((res) => {
//             console.log("✅ Teacher enrollment saved:", res.data);
//             setMessage("✅ Enrollment data saved successfully!");
//           })
//           .catch((err) => {
//             console.error("❌ Failed to save teacher enrollment:", err);
//             setMessage("❌ Failed to save data. Try again later.");
//           });
//       }
//     } else {
//       // fallback to email from URL query
//       const initialEmail = searchParams.get("email");
//       if (initialEmail) setEmail(initialEmail);
//     }
//   }, [searchParams]);

//   // Auto verify if token is present (from email link)
//   useEffect(() => {
//     const verifyEmail = async () => {
//       if (!token) return;
//       setVerifying(true);
//       try {
//         await api.get(`/auth/verify-email?token=${token}`);
//         router.push("/verification-success");
//       } catch (err: any) {
//         alert("❌ Invalid or expired verification link");
//       } finally {
//         setVerifying(false);
//       }
//     };
//     verifyEmail();
//   }, [token, router]);

//   // Resend email timer
//   useEffect(() => {
//     if (timer > 0) {
//       const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [timer]);

//   const handleResend = async () => {
//     if (!email) {
//       setMessage("Please enter a valid email.");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         "http://localhost:3000/users/resend-email-verification",
//         { email }
//       );
//       setMessage(res.data.message || "Verification email sent!");
//       setTimer(30);
//     } catch (err: any) {
//       setMessage(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   const handleOk = () => {
//     router.push("/verification-success");
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

//         <button
//           onClick={handleOk}
//           className="bg-green-600 text-white px-4 py-2 rounded-md w-full font-semibold hover:bg-green-700 transition"
//         >
//           OK
//         </button>

//         {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
//       </div>
//     </div>
//   );
// }

