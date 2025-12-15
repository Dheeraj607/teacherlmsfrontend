"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import api from "@/app/lib/api";

export enum PaymentType {
  FREE = "free",
  PAID = "paid",
  // SUBSCRIPTION = "subscription",
}

interface Props {
  packageId: number;
}

export default function PackagePaymentSettingsForm({ packageId }: Props) {
  const router = useRouter(); // ✅ Init router

  const [formData, setFormData] = useState({
    paymentType: PaymentType.PAID,
    price: 0,
    currency: "USD",
    isRecurring: false,
    recurringIntervalDays: 0,
  });

  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState<number | null>(null);

  // ✅ Fetch payment settings by packageId
  useEffect(() => {
    if (!packageId) return;

    const fetchPaymentSettings = async () => {
      try {
        const res = await api.get(`/package-payment-settings/${packageId}`);
        if (res.data) {
          setFormData({
            paymentType: res.data.paymentType || PaymentType.PAID,
            price: Number(res.data.price) ?? 0,
            currency: res.data.currency || "USD",
            isRecurring: Boolean(res.data.isRecurring),
            recurringIntervalDays: Number(res.data.recurringIntervalDays) || 0,
          });
          setExistingId(res.data.id); // ✅ store existing record ID
        }
      } catch {
        console.log("No existing settings, will create new.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSettings();
  }, [packageId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "recurringIntervalDays"
          ? value === "" ? "" : Number(value) // prevent NaN
          : value,
    }));
  };

  // ✅ Submit (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      packageId: Number(packageId),
      paymentType: formData.paymentType,
      price:
        formData.paymentType !== PaymentType.FREE ? Number(formData.price) : 0,
      currency:
        formData.paymentType !== PaymentType.FREE ? formData.currency : "USD",
      isRecurring: formData.isRecurring,
      recurringIntervalDays: formData.isRecurring
        ? Number(formData.recurringIntervalDays)
        : 0,
    };

    console.log("Submitting payload:", payload);

    try {
      if (existingId) {
        await api.patch(`/package-payment-settings/${existingId}`, payload);
        alert("Payment settings updated successfully!");
      } else {
        await api.post(`/package-payment-settings`, payload);
        alert("Payment settings created successfully!");
      }

      // ✅ Redirect to package listing after save
      router.push("/dashboard/packages");
    } catch (err: any) {
      console.error("❌ Error submitting package payment settings:", {
        message: err.message,
        data: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
        config: err.config,
      });
      alert("Failed to save payment settings");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md font-sans">
      {/* Payment Type */}
      <div>
        <label className="block mb-1 font-medium">Payment Type</label>
        <select
          name="paymentType"
          value={formData.paymentType || PaymentType.PAID}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value={PaymentType.FREE}>Free</option>
          <option value={PaymentType.PAID}>Paid</option>
          {/* <option value={PaymentType.SUBSCRIPTION}>Subscription</option> */}
        </select>
      </div>

      {/* Price + Currency */}
      {formData.paymentType !== PaymentType.FREE && (
        <>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={Number.isNaN(formData.price) ? "" : formData.price}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </>
      )}

      {/* Recurring */}
      {/* <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isRecurring"
          checked={Boolean(formData.isRecurring)}
          onChange={handleChange}
        />
        <label>Recurring Payment</label>
      </div>

      {formData.isRecurring && (
        <div>
          <label className="block mb-1 font-medium">
            Recurring Interval (days)
          </label>
          <input
            type="number"
            name="recurringIntervalDays"
            value={
              Number.isNaN(formData.recurringIntervalDays)
                ? ""
                : formData.recurringIntervalDays
            }
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      )} */}

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Save Payment Settings
      </button>
    </form>
  );
}
