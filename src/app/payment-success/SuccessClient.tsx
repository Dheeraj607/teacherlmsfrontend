"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  // const transactionId = searchParams?.get("transactionId");
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [renewalMessage, setRenewalMessage] = React.useState<string>("Processing your renewal...");
  const [isRenewing, setIsRenewing] = React.useState<boolean>(false);
  const triggerRef = React.useRef(false);

  useEffect(() => {
    const id = searchParams.get("transactionId");
    if (id) setTransactionId(id);
  }, [searchParams]);


  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL_TUNNEL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000";

  // ✅ Delete enrollment if it exists (Cleanup)
  const deleteEnrollment = async () => {
    try {
      const paymentData = localStorage.getItem("paymentData");
      if (!paymentData) return;

      const parsed = JSON.parse(paymentData);
      const email = parsed.teacher?.email;

      if (!email) return;

      // Make this call but don't fail if it's 404 (enrollment might not exist for renewals)
      await fetch(`${API_URL}/teacher-enrollment/by-email?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      console.log("Cleanup: Enrollment deletion attempted");
      localStorage.removeItem("paymentData");
      localStorage.removeItem("teacherAdminPackageId");
    } catch (err) {
      console.warn("Minor: Cleanup error (ignorable):", err);
    }
  };

  // ✅ Trigger renewal to update end date in DB
  const triggerRenewal = async () => {
    if (triggerRef.current) return;
    triggerRef.current = true;

    setIsRenewing(true);
    try {
      console.log("🔄 Triggering package renewal...");
      const res = await api.post("/admin-packages/renew");
      if (res.status === 200 || res.status === 201) {
        console.log("✅ Package end date updated successfully");
        setRenewalMessage("✅ Package extended successfully!");
      } else {
        setRenewalMessage("⚠️ Payment success, but renewal update failed. Please contact support.");
      }
    } catch (err: any) {
      console.error("❌ Error triggering renewal:", err);
      setRenewalMessage("❌ Failed to update end date. Please contact support.");
    } finally {
      setIsRenewing(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      // Only trigger deletion and renewal when payment is successful
      deleteEnrollment();
      triggerRenewal();
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

      <p style={{ ...styles.text, color: renewalMessage.includes("✅") ? "green" : "orange", fontWeight: "bold" }}>
        {isRenewing ? "⏳ Updating your account..." : renewalMessage}
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
