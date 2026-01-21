"use client";
import "@/app/css/style.css"; // Adjust the path if different


import React, { useState, useEffect } from "react";
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("teacherId", data.teacher.id.toString());
        localStorage.setItem("teacherName", data.teacher.name);
        localStorage.setItem("teacherEmail", data.teacher.email);

        if (data.redirectStatus === "PAYMENT_PENDING") {
          toast.warning("Payment not completed yet.");
          router.push("/payment-requests");
          return;
        }

        if (data.redirectStatus === "PLAN_EXPIRED") {
          toast.warning("Your package plan has expired.");
          router.push("/renew-package");
          return;
        }

        if (data.redirectStatus === "NO_PACKAGE") {
          toast.info("Please purchase a package to continue.");
          router.push("/packages");
          return;
        }

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
                <form onSubmit={handleLogin}>
                  <div className="col mb-4">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                      required
                    />
                  </div>

                  <div className="col mb-4 d-grid gap-2">
                    <button
                      type="submit" // important
                      className={`btn ${loading ? "disabled" : ""}`}
                      style={{
                        borderRadius: "50px",
                        backgroundColor: "#7F00FF",
                        color: "#fff",
                        padding: "0.5rem 1.5rem",
                        border: "none",
                      }}
                    >
                      {loading ? "Logging in..." : "Log In"}
                    </button>

                  </div>
                </form>



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
                {/* Forgot Password Link */}
                <div className="col mb-4 text-center">
                  <a
                    href="#"
                    className="text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/forgot-password");
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>

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
