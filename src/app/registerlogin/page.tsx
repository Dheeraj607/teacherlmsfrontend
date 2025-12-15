// "use client";

// import React from "react";
// import RegisterForm from "@/app/components/RegisterForm";
// import Link from "next/link";

// export default function AuthPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 relative">
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

//       <div className="relative z-10 w-full max-w-lg bg-white/95 rounded-xl shadow-lg p-8">
//         <div className="text-center mb-6">
//           <h3 className="text-gray-500 text-sm">Don’t have an account?</h3>
//           <h2 className="text-2xl font-semibold text-indigo-700">
//             Create Account
//           </h2>
//         </div>

//         <RegisterForm />

//         <p className="text-center text-sm mt-6 text-gray-600">
//           Already have an account?{" "}
//           <Link href="/login" className="text-indigo-700 font-semibold">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }








// "use client";

// import React from "react";
// import "@/app/css/style.css";
// import Link from "next/link";
// import RegisterForm from "@/app/components/RegisterForm";

// export default function RegisterPage() {
//   return (
//     // 1. APPLY full-height to the main section
//     <section className="container-fluid g-0 full-height">
      
//       {/* 2. ADD h-100 to the row to ensure columns fill the height */}
//       <div className="row g-0 h-100">

//         {/* LEFT COLUMN */}
//         <div className="col-md-6 d-flex justify-content-center align-items-center left-section p-5">
//           <div style={{ maxWidth: "380px", width: "100%" }}>
//             <div className="text-center mb-4">
//               <img src="/images/logo.jpg" alt="Logo" className="img-fluid mb-3" />
              
//               <div className="image-box w-100 mb-3">
//                 {/* 3. REMOVED: Redundant <img> tag. The image is loaded via CSS background in .image-box. 
//                     Keeping this div empty allows the CSS background image to show clearly. */}
//               </div>
              
//               <p className="text-muted">Join us and create your account in a few seconds.</p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN (REGISTRATION FORM) */}
//         <div className="col-md-6 registrationform p-5">
//           <div className="w-100" style={{ maxWidth: "520px", margin: "auto" }}>
//             <h2 className="mb-4 text-center">Create Account</h2>

//             {/* RegisterForm component */}
//             <RegisterForm />

//             <p className="text-center text-sm mt-3 text-light">
//               Already have an account?{" "}
//               <Link href="/login" className="text-light font-semibold">Login</Link>
//             </p>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }




"use client";

import React from "react";
import Link from "next/link";
import RegisterForm from "@/app/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="flex min-h-screen font-sans">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-white p-10">
        <img src="/images/logo.jpg" alt="Logo" className="w-40 mb-6" />
        <div className="w-full max-w-sm h-80 bg-[url('/images/registerImg.jpg')] bg-contain bg-center bg-no-repeat mb-6"></div>
        <p className="text-gray-500 text-center">
          Join us and create your account in a few seconds.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-10" 
           style={{ background: 'linear-gradient(to bottom, #13e5da 0%, #464cc8 50%, #9428cc 100%)' }}>
        <div className="w-full max-w-md bg-transparent rounded-lg">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>

          {/* Form */}
          <RegisterForm />

          <p className="text-center mt-4 text-white text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>

    </section>
  );
}


































































































