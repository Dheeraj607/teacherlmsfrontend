"use client";

import PackageForm from "@/app/components/PackageForm";
import { useRouter } from "next/navigation";

export default function CreatePackagePage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">
         Create Package
      </h2>

      <PackageForm
        onSuccess={() => {
          return router.push("/dashboard/packages");
        }}
      />
    </div>
  );
}
