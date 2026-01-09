// "use client";

// import React from "react";
// import LoginForm from "@/app/components/LoginForm";
// import Link from "next/link";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 relative">
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

//       <div className="relative z-10 w-full max-w-lg bg-white/95 rounded-xl shadow-lg p-8">
//         <div className="text-center mb-6">
//           <h3 className="text-gray-500 text-sm">Welcome Back!</h3>
//           <h2 className="text-2xl font-semibold text-purple-700">
//             Login to Continue
//           </h2>
//         </div>

//         <LoginForm />

//         <p className="text-center text-sm mt-6 text-gray-600">
//           Don’t have an account?{" "}
//           <Link href="/" className="text-purple-700 font-semibold">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";
import "@/app/css/style.css"; // Adjust the path if different


import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "@/utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


 useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        // No token, go to landing page
        router.replace("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);
  
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      // Handle phone verification
      if (data.status === "PHONE_NOT_VERIFIED") {
        localStorage.setItem("pendingPhone", data.phone);
        localStorage.setItem("pendingEmail", email);
        await api.post("/users/resend-otp", { phone: data.phone });
        toast.info("Phone not verified. OTP sent.");
        router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}`);
        return;
      }

      // Handle email verification
      if (data.status === "EMAIL_NOT_VERIFIED") {
        localStorage.setItem("pendingEmail", data.email);
        const selectedPackageId = localStorage.getItem("selectedPackageId");
        const url = selectedPackageId
          ? `/verify-email?email=${encodeURIComponent(data.email)}&packageId=${selectedPackageId}`
          : `/verify-email?email=${encodeURIComponent(data.email)}`;
        toast.info("Email not verified. Redirecting to verification page.");
        router.push(url);
        return;
      }

      // Successful login
      if (data.status === "SUCCESS") {
        if (data.redirectStatus === "PAYMENT_PENDING") {
          toast.warning("Payment not completed yet. Redirecting to payment page.");
          router.push("/payment-requests");
          return;
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("teacherId", data.teacher.id.toString());
  localStorage.setItem("teacherName", data.teacher.name);
  localStorage.setItem("teacherEmail", data.teacher.email);
        
        toast.success("Login successful!");
        router.push("/dashboard");
        return;
      }

      // Catch other statuses
      toast.error(data.message || "Login failed. Please check your credentials.");
    } catch (err: any) {
      // console.error(err);
      // If backend returns 401 or similar
      if (err.response?.status === 401) {
        toast.error("Invalid email or password!");
      } else {
        toast.error(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-fluid g-0 font-sans">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container g-0" style={{ height: "100vh" }}>
        <div className="col loginpage">
          <div className="row g-5">
            {/* Left side: Login Form */}
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <div className="loginarea w-100">
               <h1 className="mb-0 mt-5" style={{ fontWeight: "bold" }}>Welcome Back</h1>

                <h6 className="mb-4">Login to access all your data</h6>

                <div className="col mb-4">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

              <div className="col mb-4 d-grid gap-2">
  <button
    className={`btn ${loading ? "disabled" : ""}`}
    onClick={handleLogin}
    style={{
      borderRadius: "50px",       // makes it oval
      backgroundColor: "#7F00FF", // violet color
      color: "#fff",              // text color white
      padding: "0.5rem 1.5rem",   // adjust size
      border: "none",             // remove default border
    }}
  >
    {loading ? "Logging in..." : "Log In"}
  </button>
</div>


                {/* <div className="countinuediv text-center mb-3">
                  <p><span style={{ background: "#fff", padding: "5px 10px" }}>Continue with</span></p>
                </div> */}

                  {/* <div className="col mb-4 d-grid gap-2">
  <button
    className="btn btn-outline-secondary"
    style={{ borderRadius: "50px", padding: "0.5rem 1.5rem" }}
  >
    Login with Google
  </button>
</div>


               <div className="col mb-3 d-grid gap-2">
  <button
    className="btn btn-outline-secondary"
    style={{ borderRadius: "50px", padding: "0.5rem 1.5rem" }}
  >
    Login with Facebook
  </button>
</div> */}


                <div className="col mb-4 text-center">
                  <p>Don't have an account? <a href="/registerlogin">Register</a></p>
                </div>
              </div>
            </div>
            

            {/* Right side: Background image */}
           <div className="col-md-6 loginBg">
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
