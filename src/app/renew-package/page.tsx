"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RenewPackagePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem("teacherEmail");
                if (!email) {
                    toast.error("User email not found. Please login again.");
                    return;
                }

                // We'll use the profile and latest-purchased endpoints instead
                const [profileRes, pkgRes] = await Promise.all([
                    api.get(`/profile?email=${encodeURIComponent(email)}`).catch(() => ({ data: null })),
                    api.get(`/admin-packages/latest-purchased?email=${encodeURIComponent(email)}`).catch(() => ({ data: null }))
                ]);

                if (profileRes.data || pkgRes.data) {
                    const profileData = profileRes.data;
                    const pkgData = pkgRes.data;

                    const packageName = pkgData?.packageName || "N/A";
                    const packagePrice = pkgData?.packagePrice ?? 0;
                    const enrollmentId = pkgData?.teacherAdminPackageId || profileData?.teacherAdminPackageId || localStorage.getItem("teacherAdminPackageId");

                    const normalized = {
                        teacherName: profileData?.name || pkgData?.teacherName,
                        teacherEmail: profileData?.email || pkgData?.teacherEmail || email,
                        teacherPhone: profileData?.phone || pkgData?.teacherPhone,
                        packageName: packageName,
                        packagePrice: packagePrice,
                        teacherAdminPackageId: enrollmentId,
                    };

                    setEnrollmentData(normalized);

                    // Persist for downstream
                    const paymentDataObj = {
                        teacher: {
                            name: normalized.teacherName,
                            email: normalized.teacherEmail,
                            phone: normalized.teacherPhone,
                        },
                        selectedPackage: {
                            id: pkgData?.packageId || pkgData?.id,
                            name: packageName,
                            finalPrice: packagePrice,
                            enrollmentId: enrollmentId,
                        },
                        teacherAdminPackageId: enrollmentId,
                    };
                    localStorage.setItem("paymentData", JSON.stringify(paymentDataObj));

                    toast.success("✅ Data fetched successfully!");
                } else {
                    toast.error("Failed to load enrollment details.");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Failed to load enrollment details");
            } finally {
                setFetchingData(false);
            }
        };
        fetchData();
    }, []);

    const handleRenew = async () => {
        if (!enrollmentData) {
            return toast.error("Missing enrollment data");
        }

        // Use packagePrice from the new API, fallback to latestPackage structure if needed
        const price = Number(enrollmentData.packagePrice ?? enrollmentData.latestPackage?.paymentSettings?.price ?? 0);
        const email = enrollmentData.teacherEmail || localStorage.getItem("teacherEmail");

        setLoading(true);
        try {
            if (price <= 0) {
                // ✅ Free package: use existing auto-renewal logic
                await api.post("/admin-packages/renew");
                toast.success("Package renewed successfully!");
                router.push("/dashboard");
            } else {
                // 💳 Paid package: redirect to payment request page
                toast.success("Redirecting to payment request...");
                router.push(`/payment-requests?email=${encodeURIComponent(email || "")}`);
            }
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || err.message || "Failed to renew package"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container py-5">
            <ToastContainer position="top-center" autoClose={3000} />

            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <h2 className="mb-3">⚠️ Package Expired</h2>
                    <p className="mb-4">
                        Your package plan has expired. Please renew to continue using the
                        dashboard.
                    </p>

                    {fetchingData ? (
                        <p>Loading enrollment details...</p>
                    ) : (
                        <>
                            {/* {enrollmentData && (
                                <div className="mb-4 p-3 bg-light border rounded">
                                    <p className="mb-1 font-bold">
                                        Package: {enrollmentData.packageName || "N/A"}
                                    </p>
                                    <p className="text-primary font-bold">
                                        Price: ₹ {enrollmentData.packagePrice || 0}
                                    </p>
                                    <p className="text-muted text-sm">
                                        Account: {enrollmentData.teacherEmail}
                                    </p>
                                </div>
                            )} */}
                            <button
                                className="btn btn-primary px-4 py-2"
                                onClick={handleRenew}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Renew Package"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
