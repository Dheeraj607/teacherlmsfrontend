// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function VerificationSuccessPage() {
//   const router = useRouter();
//   const [packageData, setPackageData] = useState<any>(null);
//   const [registrationData, setRegistrationData] = useState<any>(null);
//   const [teacherAdminPackageId, setTeacherAdminPackageId] = useState<number | null>(null);
//   const [isLoginFlow, setIsLoginFlow] = useState(false);

//   useEffect(() => {
//     const savedPackage = localStorage.getItem("selectedPackage");
//     const savedRegistration = localStorage.getItem("registrationData");
//     const savedTAP = localStorage.getItem("teacherAdminPackageId");
//     const fromLogin = localStorage.getItem("emailVerifiedFromLogin");

//     const packageParsed = savedPackage ? JSON.parse(savedPackage) : null;
//     const registrationParsed = savedRegistration ? JSON.parse(savedRegistration) : null;
//     const tapParsed = savedTAP ? JSON.parse(savedTAP) : null;

//     setPackageData(packageParsed);
//     setRegistrationData(registrationParsed);
//     setTeacherAdminPackageId(tapParsed);

//     if (fromLogin) setIsLoginFlow(true);

//     // 🟢 Save Teacher Enrollment ONLY during registration flow
//     // 🟢 Save Teacher Enrollment whenever email verification is successful
// if (registrationParsed) {
//   if (!tapParsed) {
//     console.error("❌ TeacherAdminPackageId missing in localStorage!");
//   } else {
//     const enrollmentPayload = {
//       teacher: {
//         id: registrationParsed.id,
//         teacherAdminPackageId: tapParsed, // ← REAL FIX
//         name: registrationParsed.name,
//         email: registrationParsed.email,
//         phone: registrationParsed.phone,
//         dob: registrationParsed.dob,
//       },

//       admin: registrationParsed.admin || null,
//       domain: registrationParsed.domain || null,

//       selectedPackage: packageParsed
//         ? {
//             id: packageParsed.id,
//             name: packageParsed.name,
//             price: packageParsed.price, // ← send price from frontend
//             description: packageParsed.description,
//           }
//         : null,
//     };

//     axios
//       .post("http://localhost:3000/teacher-enrollment/save", enrollmentPayload)
//       .then((res) => console.log("Teacher Enrollment Saved:", res.data))
//       .catch((err) => console.error("❌ Error saving enrollment:", err));
//   }
// }

//     const timer = setTimeout(() => {
//       if (fromLogin) {
//         localStorage.removeItem("emailVerifiedFromLogin");
//         router.push("/registerlogin");
//       } else {
//         router.push("/payment-requests");
//       }
//     }, 2500);

//     return () => clearTimeout(timer);
//   }, [router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-white p-8 rounded-2xl shadow-md text-center">
//         <h1 className="text-2xl font-semibold text-green-600 mb-4">
//           ✅ Email Verified Successfully
//         </h1>
//         <p className="text-gray-600 mb-6">
//           {isLoginFlow
//             ? "Redirecting you to the login page..."
//             : "Your email has been verified. Redirecting you to the payment page..."}
//         </p>

//         {!isLoginFlow && packageData && (
//           <div className="mb-3">
//             <p className="text-gray-800 font-semibold">
//               Selected Package: {packageData.name}
//             </p>
//             <p className="text-sm text-gray-600">Price: ₹{packageData.price}</p>
//           </div>
//         )}

//         {!isLoginFlow && registrationData && (
//           <div className="mb-3 text-sm text-gray-700">
//             <p>Name: {registrationData.name}</p>
//             <p>Email: {registrationData.email}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function VerificationSuccessPage() {
  const router = useRouter();
  const [packageData, setPackageData] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isLoginFlow, setIsLoginFlow] = useState(false);

 useEffect(() => {
  // Load data
  const savedPackage = localStorage.getItem("selectedPackage");
  const savedRegistration = localStorage.getItem("registrationData");
  const fromLogin = localStorage.getItem("emailVerifiedFromLogin");

  const packageParsed = savedPackage ? JSON.parse(savedPackage) : null;
  const registrationParsed = savedRegistration ? JSON.parse(savedRegistration) : null;

  setPackageData(packageParsed);
  setRegistrationData(registrationParsed);
  setIsLoginFlow(!!fromLogin);

  // ✅ ALWAYS verify all — no need to check email
  axios
    .patch(`${API_URL}/teacher-enrollment/verify-all`)
    .then(() => {
      console.log("✅ All enrollments marked as emailVerified = true");
    })
    .catch((err) => {
      console.error("❌ Failed to update emailVerified:", err);
    });

  // Redirect after 2.5 seconds
  const timer = setTimeout(() => {
    if (fromLogin) {
      localStorage.removeItem("emailVerifiedFromLogin");
      router.push("/registerlogin");
    } else {
      router.push("/payment-requests");
    }
  }, 2500);

  return () => clearTimeout(timer);
}, [router]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          ✅ Email Verified Successfully
        </h1>
        <p className="text-gray-600 mb-6">
          {isLoginFlow
            ? "Redirecting you to the login page..."
            : "Your email has been verified. Redirecting you to the payment page..."}
        </p>

        {!isLoginFlow && packageData && (
          <div className="mb-3">
            <p className="text-gray-800 font-semibold">
              Selected Package: {packageData.name}
            </p>
            <p className="text-sm text-gray-600">Price: ₹{packageData.price}</p>
          </div>
        )}

        {!isLoginFlow && registrationData && (
          <div className="mb-3 text-sm text-gray-700">
            <p>Name: {registrationData.name}</p>
            <p>Email: {registrationData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}