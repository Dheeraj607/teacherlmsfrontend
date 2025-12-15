"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";

export default function RegisteredStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("/users/my-students"); // DON'T CHANGE
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Suspend / Activate Handler
  // -------------------------
  const toggleSuspend = async (student: any) => {
    const suspend = student.status === 1;
    setProcessing(student.id);

    try {
      await api.patch(`/users/${student.id}/suspend`, { suspend });
      await loadStudents();
    } catch (err: any) {
      console.error("Error toggling suspend:", err);
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(null);
    }
  };

  // Convert PDF
  const convertPdfToBase64 = (pdf: any) => {
    try {
      return typeof window !== "undefined"
        ? `data:application/pdf;base64,${btoa(
            String.fromCharCode(...new Uint8Array(pdf.data || pdf))
          )}`
        : "";
    } catch {
      return "";
    }
  };

const statusBadge = (status: number) => {
  switch (status) {
    case 1:
      return (
        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-800 rounded-full">
          Active
        </span>
      );
    case 2:
      return (
        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded-full">
          Suspended (Teacher)
        </span>
      );
    case 3:
      return (
        <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
          Suspended (Admin)
        </span>
      );
  }
};



  return (
    <div className="p-8 font-sans">
      <h2 className="text-3xl font-bold mb-4">Registered Students</h2>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="table-primary bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Domain</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Edit</th>
                <th className="px-4 py-2 text-left">Payments</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s: any) => {
                const fullName = [s.firstName, s.middleName, s.lastName]
                  .filter(Boolean)
                  .join(" ");

                const isProcessing = processing === s.id;

                return (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{fullName}</td>
                    <td className="px-4 py-2">{s.contact?.primaryEmail || "-"}</td>
                    <td className="px-4 py-2">{s.contact?.primaryPhone || "-"}</td>
                    <td className="px-4 py-2">{s.domain || "-"}</td>

                    {/* Status Badge */}
{/* Status Badge */}
 <td className="px-4 py-2">{statusBadge(s.status)}
  
 </td>



                    {/* ACTION BUTTON */}
                    <td className="px-4 py-2">
                      {s.status === 3 ? (
                        <span className="px-3 py-1 border border-gray-300 text-gray-400 rounded-md text-sm cursor-not-allowed">
                          Admin Suspended
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleSuspend(s)}
                          disabled={isProcessing}
                          className={`px-3 py-1 rounded-md text-sm border transition ${
                            isProcessing
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-50 cursor-pointer"
                          }`}
                        >
                          {isProcessing
                            ? "Processing..."
                            : s.status === 1
                            ? "Suspend"
                            : "Activate"}
                        </button>
                      )}
                    </td>

                    {/* EDIT BUTTON */}
                    <td className="px-4 py-2">
<button
  onClick={() => router.push(`/dashboard/registered-students/${s.id}/edit`)}
  className="btn btn-sm btn-primary"
>
  Edit
</button>




                    </td>

                    {/* Payments */}
                    <td className="px-4 py-2 space-y-1">
                      {s.payments && s.payments.length > 0 ? (
                        s.payments.map((payment: any) => (
                          <div key={payment.id || payment.transaction_id}>
                            {payment.invoice_pdf ? (
                              <a
                                href={`data:application/pdf;base64,${btoa(
                                  String.fromCharCode(
                                    ...new Uint8Array(
                                      payment.invoice_pdf.data || payment.invoice_pdf
                                    )
                                  )
                                )}`}
                                download={`${payment.invoice_no || payment.transaction_id}.pdf`}
                                className="text-blue-600 underline"
                              >
                                {payment.invoice_no || payment.transaction_id}
                              </a>
                            ) : (
                              <span>{payment.invoice_no || payment.transaction_id}</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
