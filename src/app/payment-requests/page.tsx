"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://d1ojm6zdv3m37g.cloudfront.net";

export default function TeacherPaymentRequestPage() {
  const [email, setEmail] = useState("");
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch teacher enrollment by email
  const fetchEnrollment = async (email: string) => {
    if (!email) return toast.warn("Please enter an email");

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/teacher-enrollment/by-email?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error("Failed to fetch enrollment");

      const data = await res.json();
      console.log("Fetched teacher enrollment data:", data);

      if (data) {
        // Normalize teacher enrollment ID for consistent usage
        const enrollmentId =
          data.teacherAdminPackageId ??
          data.teacher_admin_package_id ??
          data.enrollmentId ??
          data.selectedPackage?.id ??
          null;

        // Fetch the **final price** from selectedPackage or fallback
        const finalPrice =
          data.selectedPackage?.finalPrice ??
          data.packagePrice ?? // fallback
          0;

        const normalized = { ...data, teacherAdminPackageId: enrollmentId, packagePrice: finalPrice };
        setEnrollmentData(normalized);

        // Persist paymentData for downstream pages
        const paymentDataObj = {
          teacher: {
            name: data.teacherName ?? data.teacher?.name ?? "",
            email: data.teacherEmail ?? data.teacher?.email ?? "",
            phone: data.teacherPhone ?? data.teacher?.phone ?? "",
            ...(data.teacher && typeof data.teacher === "object" ? data.teacher : {}),
          },
          selectedPackage: {
            id: data.selectedPackage?.id ?? data.packageId ?? null,
            name: data.packageName ?? data.selectedPackage?.name ?? "",
            finalPrice: finalPrice,
            description: data.selectedPackage?.description ?? "",
            enrollmentId: enrollmentId,
          },
          teacherAdminPackageId: enrollmentId,
          raw: data,
        };
        localStorage.setItem("paymentData", JSON.stringify(paymentDataObj));

        toast.success("✅ Enrollment data fetched!");
      } else {
        setEnrollmentData(null);
        toast.info("No enrollment found for this email");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error fetching enrollment");
    } finally {
      setLoading(false);
    }
  };

  // Create payment request
 const handlePay = async () => {
  if (!enrollmentData) return toast.error("❌ No enrollment data available");

  const teacherAdminPackageId = enrollmentData.teacherAdminPackageId;
  if (!teacherAdminPackageId) {
    toast.error("❌ Teacher enrollment ID not found");
    console.error("Enrollment data missing ID:", enrollmentData);
    return;
  }

  const amount = Number(enrollmentData.packagePrice);

  try {
    setLoading(true);

if (amount <= 0) {
  // ✅ Free package: create successful payment request directly
  const res = await fetch(`${API_URL}/payment-requests/free`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentTeacherPackageId: teacherAdminPackageId,
      amount: 0, // <- include this
      purpose: enrollmentData.packageName,
      type: "teacher",
      customer_name: enrollmentData.teacherName,
      customer_email: enrollmentData.teacherEmail,
      customer_phone: enrollmentData.teacherPhone,
    }),
  });

  const data = await res.json();
  console.log("Free payment created:", data);

  toast.success("✅ Free package registered successfully!");
  window.location.href = "/payment-success";
  return;
}
  

    // 💳 Paid package: proceed with normal payment flow
    const body = {
      studentTeacherPackageId: teacherAdminPackageId,
      externalId: Number(teacherAdminPackageId),
      amount,
      gst: 0,
      basicamount: amount,
      successUrl: window.location.origin + "/payment-success",
      failureUrl: window.location.origin + "/payment-failed",
      purpose: enrollmentData.packageName,
      vendor_name: "Vendor A",
      vendor_address: "123 Business Street",
      vendor_email: "vendor@example.com",
      vendor_contact_no: "9876543210",
      vendor_gst_no: "22ABCDE1234F2Z5",
      customer_name: enrollmentData.teacherName,
      customer_email: enrollmentData.teacherEmail,
      customer_phone: enrollmentData.teacherPhone,
      customer_address: "",
      type: "teacher",
    };

    console.log("Creating payment order:", body);

    const res = await fetch(`${API_URL}/payment-requests/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Payment order response:", data);

    if (data.paymentRequest?.transaction_id) {
      toast.success("✅ Payment order created!");
      window.location.href = `/make-payment?transactionId=${data.paymentRequest.transaction_id}&teacherAdminPackageId=${teacherAdminPackageId}`;
    } else {
      toast.error("❌ Could not create payment order");
    }
  } catch (err) {
    console.error(err);
    toast.error("❌ Error processing payment");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Teacher Payment Request</h2>

      {/* Email input + Fetch button */}
      <div className="flex space-x-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter teacher email"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => fetchEnrollment(email)}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Fetch
        </button>
      </div>

      {/* Show fetched enrollment data */}
      {enrollmentData && (
        <div className="space-y-3 mt-4">
          <input
            value={enrollmentData.teacherName}
            readOnly
            placeholder="Name"
            className="w-full p-2 border rounded bg-gray-100"
          />
          <input
            value={enrollmentData.teacherEmail}
            readOnly
            placeholder="Email"
            className="w-full p-2 border rounded bg-gray-100"
          />
          <input
            value={enrollmentData.teacherPhone}
            readOnly
            placeholder="Phone"
            className="w-full p-2 border rounded bg-gray-100"
          />
          <input
            value={enrollmentData.packagePrice} // now shows finalPrice
            readOnly
            placeholder="Amount"
            className="w-full p-2 border rounded bg-gray-100"
          />
          <input
            value={enrollmentData.packageName}
            readOnly
            placeholder="Purpose"
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading || !enrollmentData}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
      >
        {loading ? "Processing..." : "Pay Now 💳"}
      </button>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="dark" />
    </div>
  );
}
