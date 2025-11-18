"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";

interface Props {
  packageId: number;
}

interface PackageSettingsFormData {
  id?: number;
  otpless_checkout: boolean;
  availability_of_seats: boolean;
  no_of_seats?: number;
  trial_available: boolean;
  trial_days?: number;
  email_notification: boolean;
  override_payment_gateway: boolean;
  facebook_pixel_enabled: boolean;
  facebook_pixel_id?: string;
  payment_cycles_enabled: boolean;
}

const defaultFormData: PackageSettingsFormData = {
  otpless_checkout: false,
  availability_of_seats: false,
  no_of_seats: undefined,
  trial_available: false,
  trial_days: undefined,
  email_notification: false,
  override_payment_gateway: false,
  facebook_pixel_enabled: false,
  facebook_pixel_id: "",
  payment_cycles_enabled: false,
};

export default function PackageSettingsForm({ packageId }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<PackageSettingsFormData>(defaultFormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get(`/package-settings/packages/${packageId}`);
        if (res.data) {
          setFormData({ ...defaultFormData, ...res.data, id: res.data.id });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [packageId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

const payload = {
  otpless_checkout: Boolean(formData.otpless_checkout),
  availability_of_seats: Boolean(formData.availability_of_seats),
  no_of_seats: formData.availability_of_seats ? Number(formData.no_of_seats || 0) : null,
  trial_available: Boolean(formData.trial_available),
  trial_days: formData.trial_available ? Number(formData.trial_days || 0) : null,
  email_notification: Boolean(formData.email_notification),
  override_payment_gateway: Boolean(formData.override_payment_gateway),
  facebook_pixel_enabled: Boolean(formData.facebook_pixel_enabled),
  facebook_pixel_id: formData.facebook_pixel_enabled
    ? formData.facebook_pixel_id || null
    : null,
  payment_cycles_enabled: Boolean(formData.payment_cycles_enabled),
};


    try {
if (formData.id) {
  // Update existing settings
  await api.put(`/package-settings/${formData.id}`, payload);
} else {
  // Create new settings
  await api.post(`/package-settings/${packageId}`, { ...payload, packageId });
}


      alert("Settings saved successfully!");
      router.push("/dashboard/packages");
    } catch (err: any) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {["otpless_checkout","availability_of_seats","trial_available","email_notification","override_payment_gateway","facebook_pixel_enabled","payment_cycles_enabled"].map(key => (
        <div key={key} className="flex items-center gap-2">
          <input type="checkbox" name={key} checked={formData[key as keyof PackageSettingsFormData] as boolean} onChange={handleChange} />
          <label>{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</label>
        </div>
      ))}

      {formData.availability_of_seats && (
        <div>
          <label>No. of Seats</label>
          <input type="number" name="no_of_seats" value={formData.no_of_seats || ""} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
      )}

      {formData.trial_available && (
        <div>
          <label>Trial Days</label>
          <input type="number" name="trial_days" value={formData.trial_days || ""} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
      )}

      {formData.facebook_pixel_enabled && (
        <div>
          <label>Facebook Pixel ID</label>
          <input type="text" name="facebook_pixel_id" value={formData.facebook_pixel_id || ""} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
      )}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Save Package Settings
      </button>
    </form>
  );
}
