"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_TUNNEL ||
  process.env.NEXT_PUBLIC_API_URL_LOCAL ||
  "http://localhost:3000";

export default function PaymentRequestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [packageId, setPackageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 Fetching package & registration data...");

    try {
      // ✅ Get stored package
      const pkgStr = localStorage.getItem("selectedPackage");
      if (pkgStr) {
        const pkg = JSON.parse(pkgStr);
        console.log("📦 Selected package:", pkg);

        setPackageId(pkg.id || null);
        setPurpose(pkg.name || "");
        setAmount(String(pkg.price || pkg.rate || pkg.specialPrice || ""));
      } else {
        console.warn("⚠️ No selectedPackage found in localStorage");
      }

      // ✅ Get registration details
      const regStr = localStorage.getItem("registrationData");
      if (regStr) {
        const reg = JSON.parse(regStr);
        console.log("👤 Registration data:", reg);

        setName(reg.name || "");
        setEmail(reg.email || "");
        setPhone(reg.phone || "");
      } else {
        console.warn("⚠️ No registrationData found in localStorage");
      }
    } catch (err) {
      console.error("❌ Error reading localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!packageId) {
      toast.error("No package selected");
      return;
    }

    setLoading(true);

const paymentData = {
  externalId: `PKG_${packageId}_${Date.now()}`,
  amount: Math.round(Number(amount) * 100) / 100,  // ✅ Fix decimals
  gst: 0,
  basicamount: Math.round(Number(amount) * 100) / 100,
  successUrl: `${window.location.origin}/payment-success`,
  failureUrl: `${window.location.origin}/payment-failed`,
  purpose,
  vendor_name: "Vendor A",
  vendor_address: "123 Business Street",
  vendor_email: "vendor@example.com",
  vendor_contact_no: "9876543210",
  vendor_gst_no: "22ABCDE1234F2Z5",
  customer_name: name,
  customer_email: email,
  customer_phone: phone,
  customer_address: "",
};


    console.log("💳 Payment payload:", paymentData);

    try {
      const res = await fetch(`${API_URL}/payment-requests/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const data = await res.json();
      console.log("💰 Payment order response:", data);

      if (data?.paymentRequest?.transaction_id) {
        toast.success("✅ Payment order created!");
        localStorage.setItem("paymentInfo", JSON.stringify(paymentData));
        localStorage.setItem(
          "transactionId",
          data.paymentRequest.transaction_id
        );
       router.push(`/make-payment?transactionId=${data.paymentRequest.transaction_id}`);

      } else {
        toast.error("❌ Could not create payment order");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error creating payment order");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading payment details...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Payment Details
      </h2>

      <div className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full p-2 border rounded"
        />
        <input
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Purpose"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4"
      >
        {loading ? "Processing..." : "Proceed to Pay 💳"}
      </button>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
    </div>
  );
}
