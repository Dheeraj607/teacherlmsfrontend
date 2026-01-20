"use client";

import { useState } from "react";
import api from "@/app/lib/api";

interface Payment {
  invoice_no: string;
  amount: number;
  status: string;
  payment_date: string;
  payment_method: string;
  vendor_name: string;
  invoice_pdf?: any;
}

interface Student {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  domain: string;
  contact?: { primaryEmail: string; primaryPhone: string };
  payments: Payment[];
}

export default function PaymentReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch students JSON for table
  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      // api instance automatically adds Authorization header via interceptor
      const res = await api.get("/users/my-students");

      let filteredStudents = res.data as Student[];

      // Filter payments by date range if dates are selected
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        filteredStudents = filteredStudents
          .map((s) => ({
            ...s,
            payments: s.payments.filter((p) => {
              const paymentDate = new Date(p.payment_date);
              return paymentDate >= start && paymentDate <= end;
            }),
          }))
          .filter((s) => s.payments.length > 0);
      }

      setStudents(filteredStudents);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF
  const downloadPdf = async () => {
    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    setError("");
    try {
      const res = await api.get(
        `/payment-requests/report/pdf?start=${startDate}&end=${endDate}`,
        {
          responseType: "blob", // PDF
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `payment_report_${startDate}_to_${endDate}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setError("Failed to download PDF");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Reports</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={fetchStudents}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
        <button
          onClick={downloadPdf}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {students.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Student Name</th>
              <th className="border px-2 py-1">Domain</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Invoice</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Method</th>
              <th className="border px-2 py-1">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) =>
              student.payments.map((payment) => (
                <tr key={payment.invoice_no}>
                  <td className="border px-2 py-1">
                    {student.firstName} {student.middleName || ""} {student.lastName}
                  </td>
                  <td className="border px-2 py-1">{student.domain}</td>
                  <td className="border px-2 py-1">{student.contact?.primaryEmail || "-"}</td>
                  <td className="border px-2 py-1">{student.contact?.primaryPhone || "-"}</td>

                  {/* Invoice as downloadable PDF */}
                  <td className="border px-2 py-1">
                    {payment.invoice_pdf ? (
                      <a
                        href={`data:application/pdf;base64,${btoa(
                          String.fromCharCode(
                            ...new Uint8Array(payment.invoice_pdf.data || payment.invoice_pdf)
                          )
                        )}`}
                        download={`${payment.invoice_no}.pdf`}
                        className="text-blue-600 underline"
                      >
                        {payment.invoice_no}
                      </a>
                    ) : (
                      <span>{payment.invoice_no}</span>
                    )}
                  </td>

                  <td className="border px-2 py-1">{payment.amount}</td>
                  <td className="border px-2 py-1">{payment.status}</td>
                  <td className="border px-2 py-1">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{payment.payment_method || "-"}</td>
                  <td className="border px-2 py-1">{payment.vendor_name || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
