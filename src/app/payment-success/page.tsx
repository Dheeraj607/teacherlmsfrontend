"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SuccessPage: React.FC = () => {
  // const searchParams = useSearchParams();
  // const transactionId = searchParams?.get("transactionId");
  const [transactionId, setTransactionId] = React.useState<string | null>(null);

useEffect(() => {
  const params = useSearchParams();
  setTransactionId(params?.get("transactionId"));
}, []);

  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_TUNNEL ||
    process.env.NEXT_PUBLIC_API_URL_LOCAL ||
    "hhttp://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000";

  // ✅ Delete enrollment if payment is success
  const deleteEnrollment = async () => {
    try {
      const paymentData = localStorage.getItem("paymentData");
      if (!paymentData) return;

      const parsed = JSON.parse(paymentData);
      const email = parsed.teacher?.email;

      if (!email) return;

      const res = await fetch(`${API_URL}/teacher-enrollment/by-email?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("Enrollment deleted successfully after payment");
        // Optionally, clear localStorage
        localStorage.removeItem("paymentData");
        localStorage.removeItem("teacherAdminPackageId");
      } else {
        console.warn("Failed to delete enrollment after payment");
      }
    } catch (err) {
      console.error("Error deleting enrollment:", err);
    }
  };

  useEffect(() => {
    if (transactionId) {
      // Only trigger deletion when payment is successful
      deleteEnrollment();
    }
  }, [transactionId]);

  const downloadInvoice = async () => {
    if (!transactionId) {
      alert("Transaction ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/payment-requests/pdfinvoice/${transactionId}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Failed to fetch invoice");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Invoice download failed:", err);
      alert("Error downloading invoice.");
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment Successful! 🎉</h1>
      <p style={styles.text}>
        Your Transaction ID: <strong>{transactionId}</strong>
      </p>

   {transactionId && (
  <button onClick={downloadInvoice} style={styles.button}>
    Download Invoice
  </button>
)}


      <button onClick={goToLogin} style={styles.loginButton}>
        Go to Login 🔐
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
  heading: {
    fontSize: 28,
    color: "green",
  },
  text: {
    marginTop: 12,
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
  },
  loginButton: {
    marginTop: 12,
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
  },
};

export default SuccessPage;
