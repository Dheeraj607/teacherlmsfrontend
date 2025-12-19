"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";
import PackageForm from "@/app/components/PackageForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditPackagePage() {
  const { id } = useParams();
  const router = useRouter();
  const [existing, setExisting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`/packages/${id}?t=${Date.now()}`);
         console.log("Fetched package data:", res.data);
        setExisting(res.data);
      } catch (err) {
        console.error("Failed to fetch package:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPackage();
  }, [id]);

  const handleCancel = () => router.push("/dashboard/packages");
  const handleSuccess = () => router.push("/dashboard/packages");

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600 text-lg">
        Loading package details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-start py-10 px-10 font-sans">

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             Edit Package
          </h2>
          {/* <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button> */}
        </div>

        {/* Form */}
        <PackageForm
          //key={id}
          key={existing?.id}  
          existing={existing}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
