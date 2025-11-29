  // "use client";

  // import { useState, useEffect } from "react";
  // import { useRouter } from "next/navigation";
  // import api from "@/app/lib/api";

  // export interface Package {
  //   id?: number;
  //   name: string;
  //   description: string;
  //   sellingPrice: string;
  //   coverImage?: string;
  // }

  // interface PackageFormProps {
  //   existing?: any;
  //   onSuccess: () => void;
  //   onCancel?: () => void;
  // }

  // export default function PackageForm({
  //   existing,
  //   onSuccess,
  //   onCancel,
  // }: PackageFormProps) {
  //   const [formData, setFormData] = useState({
  //     name: "",
  //     description: "",
  //     // sellingPrice: "",
  //     coverImage: null as File | null,
  //   });
  //   const [preview, setPreview] = useState<string | null>(null);

  //   const router = useRouter();

  //   // ✅ Pre-fill form when editing
  //   useEffect(() => {
  //     if (existing) {
  //       setFormData({
  //         name: existing.name || "",
  //         description: existing.description || "",
  //       // sellingPrice: existing.sellingPrice?.toString() || "",
  //         coverImage: null,
  //       });
  //       setPreview(existing.coverImage || null);
  //     }
  //   }, [existing]);

  //   // ✅ Handle input changes
  //   const handleChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     const { name, value, files } = e.target as any;
  //     if (name === "coverImage" && files) {
  //       const file = files[0];
  //       setFormData({ ...formData, coverImage: file });
  //       setPreview(URL.createObjectURL(file));
  //     } else {
  //       setFormData({ ...formData, [name]: value });
  //     }
  //   };

  //   // ✅ Submit form
  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (!formData.name.trim()) {
  //       alert("Package name is required");
  //       return;
  //     }

  //     const data = new FormData();
  //     data.append("name", formData.name);
  //     data.append("description", formData.description);
  //     //data.append("sellingPrice", formData.sellingPrice);

  //     if (formData.coverImage) {
  //       data.append("file", formData.coverImage); // must match backend interceptor
  //     }

  //     try {
  //       let response;
  //       if (existing?.id) {
  //         // Update
  //         response = await api.put(`/packages/${existing.id}`, data, {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         });
  //       } else {
  //         // Create
  //         response = await api.post("/packages", data, {
  //           headers: { "Content-Type": "multipart/form-data" },
  //         });
  //       }

  //       const packageId = response.data.id;
  //       onSuccess();

  //       // If newly created, go to payment settings
  //       if (!existing) {
  //         router.push(`/dashboard/package-payment-settings/${packageId}`);
  //       }
  //     } catch (err: any) {
  //       console.error("Error submitting package:", err.response?.data || err);
  //       alert("Failed to submit package: " + (err.response?.data?.message || "Unknown error"));
  //     }
  //   };

  //   return (
  //     <form
  //       onSubmit={handleSubmit}
  //       className="space-y-5 bg-white border border-gray-200 p-6 rounded-2xl shadow"
  //     >
  //       {/* Name */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Package Name
  //         </label>
  //         <input
  //           type="text"
  //           name="name"
  //           placeholder="Enter package name"
  //           value={formData.name}
  //           onChange={handleChange}
  //           required
  //           className="border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 p-3 rounded-lg w-full"
  //         />
  //       </div>

  //       {/* Description */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Description
  //         </label>
  //         <textarea
  //           name="description"
  //           placeholder="Write a short description..."
  //           value={formData.description}
  //           onChange={handleChange}
  //           rows={3}
  //           className="border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 p-3 rounded-lg w-full"
  //         />
  //       </div>

  //       {/* Price
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Price (₹)
  //         </label>
  //         <input
  //           type="number"
  //           name="sellingPrice"
  //           placeholder="Amount"
  //           value={formData.sellingPrice}
  //           onChange={handleChange}
  //           className="border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 p-3 rounded-lg w-full"
  //         />
  //       </div> */}

  //       {/* Cover Image */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1">
  //           Cover Image
  //         </label>
  //         <input
  //           type="file"
  //           name="coverImage"
  //           accept="image/*"
  //           onChange={handleChange}
  //           className="border border-gray-300 p-2 rounded-lg w-full cursor-pointer"
  //         />
  //         {preview && (
  //           <div className="mt-3 flex justify-center">
  //             <img
  //               src={preview}
  //               alt="Preview"
  //               className="w-48 h-32 object-cover rounded-lg shadow"
  //             />
  //           </div>
  //         )}
  //       </div>

  //       {/* Buttons */}
  //       <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
  //         <button
  //           type="submit"
  //           className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition w-full sm:w-auto"
  //         >
  //           {existing ? "Update Package" : "Create Package"}
  //         </button>

  //         {onCancel && (
  //           <button
  //             type="button"
  //             onClick={onCancel}
  //             className="bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg border hover:bg-gray-200 transition w-full sm:w-auto"
  //           >
  //             Cancel
  //           </button>
  //         )}
  //       </div>
  //     </form>
  //   );
  // }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";

interface PackageFormProps {
  existing?: any;
  onSuccess: () => void;
  onCancel?: () => void;
  
}

export default function PackageForm({ existing, onSuccess, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (existing) {
      setFormData({
        name: existing.name || "",
        description: existing.description || "",
        coverImage: null,
      });
      setPreview(existing.coverImage || null);
    }
  }, [existing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "coverImage" && files) {
      const file = files[0];
      setFormData({ ...formData, coverImage: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Package name is required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (formData.coverImage) data.append("file", formData.coverImage);

    try {
      let response;
      if (existing?.id) {
        response = await api.put(`/packages/${existing.id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        response = await api.post("/packages", data, { headers: { "Content-Type": "multipart/form-data" } });
      }

      onSuccess();
      if (!existing) router.push(`/dashboard/package-payment-settings/${response.data.id}`);
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit package: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="addnewform p-4 bg-white rounded-lg shadow-md max-w-2xl"
  style={{ marginLeft: "5px" }}
>

      <div className="md:col-span-2">
        {/* Package Name */}
<div className="mb-4">
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition"
    placeholder="Enter package name"
  />
</div>

     

        {/* Description (full width) */}
        <div className="md:col-span-2 mb-4">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control w-full px-4 py-2 rounded border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition resize-none"
            placeholder="Write a short description..."
            rows={3}
          />
        </div>

        {/* Cover Image (full width) */}
        <div className="md:col-span-2">
          {/*    */}
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleChange}
            className="form-control w-full"
          />
          {preview && (
            <div className="mt-3 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="rounded shadow"
                style={{ maxHeight: "150px" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-4 flex justify-end gap-2">
      <button
  type="button"
  className="btn btn-secondary"
  onClick={() => router.back()} // go back to previous page
>
  Close
</button>

        <button type="submit" className="btn btn-primary">
          {existing ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
