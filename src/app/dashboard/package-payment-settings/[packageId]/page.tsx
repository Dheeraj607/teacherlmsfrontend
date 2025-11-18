"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import PackagePaymentSettingsForm from "@/app/components/PackagePaymentSettingsForm";

export default function PackagePaymentSettingsPage() {
  const params = useParams();
  const packageId = params?.packageId ? Number(params.packageId) : null;
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) return;
      try {
        const res = await api.get(`/packages/${packageId}`);
        setPackageData(res.data);
      } catch (err) {
        console.error("Error fetching package:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  if (loading) return <p>Loading...</p>;
  if (!packageData) return <p>Package not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Payment Settings for Package: {packageData.name}
      </h1>

      {packageId && <PackagePaymentSettingsForm packageId={packageId} />}
    </div>
  );
}
