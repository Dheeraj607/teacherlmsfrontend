"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    email: "",
  });

  const [emailStatus, setEmailStatus] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("teacherEmail");
    if (!email) return;

    api.get(`/profile?email=${email}`).then((res) => {
      setProfile(res.data);
      setForm({
        name: res.data.name,
        phone: res.data.phone,
        dob: res.data.dob?.substring(0, 10),
        email: res.data.email,
      });
    });
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update Name/DOB normally
  const handleSubmit = async () => {
    try {
      const res = await api.put(`/profile/${profile.id}`, {
        name: form.name,
        dob: form.dob,
      });
      setMessage(res.data.message);

      // Update localStorage to reflect changes in sidebar
      localStorage.setItem("teacherName", form.name);

      // Trigger storage event for sidebar to update
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  // Email verification (send OTP to email)
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpVisible, setEmailOtpVisible] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleVerifyEmail = async () => {
    try {
      if (form.email === profile.email) {
        setEmailStatus("This is already your current mail.");
        return;
      }

      // Reset states
      setEmailStatus("Sending OTP...");
      setEmailOtpVisible(false);

      const res = await api.put(`/profile/${profile.id}`, { email: form.email });

      // Check if backend actually sent OTP
      if (res.data.message && res.data.message.includes("OTP")) {
        setPendingEmail(form.email);
        setEmailStatus(res.data.message);
        setEmailOtpVisible(true);
      } else {
        // If no OTP sent (e.g. minor update or no change detected)
        setEmailStatus(res.data.message || "Updated successfully");
      }
    } catch (err: any) {
      setEmailStatus(err.response?.data?.message || "Email verification failed");
      setEmailOtpVisible(false);
    }
  };

  const handleConfirmEmailOtp = async () => {
    try {
      const res = await api.post("/profile/confirm-otp", {
        userId: profile.id,
        otp: emailOtp,
        newValue: pendingEmail,
        type: 'email'
      });

      setEmailStatus(res.data.message);
      setEmailOtpVisible(false);
      setEmailOtp("");
      setPendingEmail("");

      // Update UI email after success
      setForm((prev) => ({ ...prev, email: pendingEmail }));

      // ✅ Update localStorage to reflect changes in sidebar
      localStorage.setItem("teacherEmail", pendingEmail);

      // Trigger storage event for sidebar to update
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setEmailStatus(err.response?.data?.message || "OTP verification failed");
    }
  };

  // Phone verification (send OTP)
  const handleVerifyPhone = async () => {
    try {
      if (form.phone === profile.phone) {
        setPhoneStatus("This is already your current phone number.");
        return;
      }

      // Reset states
      setPhoneStatus("Sending OTP...");
      setOtpVisible(false);

      const res = await api.put(`/profile/${profile.id}?userId=${profile.id}`, { phone: form.phone });

      // Check if backend actually sent OTP
      if (res.data.message && res.data.message.includes("OTP")) {
        setPendingPhone(form.phone);
        setPhoneStatus(res.data.message);
        setOtpVisible(true);
      } else {
        setPhoneStatus(res.data.message || "Updated successfully");
      }
    } catch (err: any) {
      setPhoneStatus(err.response?.data?.message || "Phone verification failed");
      setOtpVisible(false);
    }
  };

  const handleConfirmOtp = async () => {
    try {
      const res = await api.post("/profile/confirm-otp", {
        userId: profile.id,
        otp,
        newValue: pendingPhone,
        type: 'phone'
      });

      setPhoneStatus(res.data.message);
      setOtpVisible(false);
      setOtp("");
      setPendingPhone("");

      // Update UI phone after success
      setForm((prev) => ({ ...prev, phone: pendingPhone }));
    } catch (err: any) {
      setPhoneStatus(err.response?.data?.message || "OTP verification failed");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-lg p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* Name */}
      <label className="block mt-2">Name</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* Phone with OTP verification */}
      <label className="block mt-2">Phone</label>
      <div className="flex gap-2">
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleVerifyPhone}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Verify
        </button>
      </div>
      {phoneStatus && <p className="text-blue-600 mt-1">{phoneStatus}</p>}

      {otpVisible && (
        <div className="flex gap-2 mt-1">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleConfirmOtp}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Confirm OTP
          </button>
        </div>
      )}

      {/* DOB */}
      <label className="block mt-2">Date of Birth</label>
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      {/* Email with Verify */}
      <label className="block mt-2">Email</label>
      <div className="flex gap-2">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleVerifyEmail}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Verify
        </button>
      </div>
      {emailStatus && <p className="text-blue-600 mt-1">{emailStatus}</p>}

      {emailOtpVisible && (
        <div className="flex gap-2 mt-1">
          <input
            placeholder="Enter Email OTP"
            value={emailOtp}
            onChange={(e) => setEmailOtp(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleConfirmEmailOtp}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Confirm OTP
          </button>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        {/* Update Name/DOB */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>

        <button
          onClick={() => router.push("/dashboard/profile/change-password")}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Change Password
        </button>
      </div>

      {message && <p className="mt-3 text-green-600">{message}</p>}
    </div >
  );
}
