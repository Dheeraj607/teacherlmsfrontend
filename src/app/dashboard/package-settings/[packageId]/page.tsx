"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import PackageSettingsForm from "@/app/components/PackageSettingsForm";

export default function PackageSettingsPage() {
  const params = useParams();
  const packageId = Number(params.packageId); // ensure it's a number
  const [packageData, setPackageData] = useState<any>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`/packages/${packageId}`);
        setPackageData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (packageId) fetchPackage();
  }, [packageId]);

  if (!packageData) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl  p-4 font-sans">
      <h1 className="text-2xl font-semibold mb-4">
        Settings for Package: {packageData.name}
      </h1>

      <PackageSettingsForm packageId={packageId} />
    </div>
  );
}
