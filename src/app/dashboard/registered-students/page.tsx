"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";

export default function RegisteredStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await api.get("/users/my-students");
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Registered Students</h1>

      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Domain</th>
                <th className="px-4 py-2 text-left">Payments</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s: any) => {
                const fullName = [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
                return (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-2">{fullName}</td>
                    <td className="px-4 py-2">{s.contact?.primaryEmail || "-"}</td>
                    <td className="px-4 py-2">{s.contact?.primaryPhone || "-"}</td>
                    <td className="px-4 py-2">{s.domain || "-"}</td>
<td className="px-4 py-2 space-y-1">
  {s.payments && s.payments.length > 0 ? (
    s.payments.map((payment: any) => (
      <div key={payment.id || payment.transaction_id}>
        {payment.invoice_pdf ? (
          <a
            href={`data:application/pdf;base64,${btoa(
              String.fromCharCode(...new Uint8Array(payment.invoice_pdf.data || payment.invoice_pdf))
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
