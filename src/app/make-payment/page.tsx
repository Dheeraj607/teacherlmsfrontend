// 'use client';
// export const dynamic = 'force-dynamic';

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface Order {
//   amount: number;
//   razorpay_order_id: string;
//   success_url: string;
//   failure_url: string;
//   customer_name?: string;
//   customer_email?: string;
//   customer_phone?: string;
//   customer_address?: string;
// }

// interface CustomerDetails {
//   customer_name: string;
//   customer_email: string;
//   customer_phone: string;
//   customer_address: string;
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000";
// const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_bgUFcUzfDPatTa";

// const Product: React.FC = () => {
//   const searchParams = useSearchParams();
//   const transaction_id = searchParams?.get("transactionId");
//   const [order, setOrder] = useState<Order | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
//     customer_name: "",
//     customer_email: "",
//     customer_phone: "",
//     customer_address: "",
//   });

//   // Load Razorpay checkout script (add once)
//   useEffect(() => {
//     const id = "razorpay-checkout-script";
//     if (!document.getElementById(id)) {
//       const script = document.createElement("script");
//       script.id = id;
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       document.body.appendChild(script);
//       return () => {
//         // keep script (checkout lib is fine to remain), but remove if you prefer:
//         // document.getElementById(id)?.remove();
//       };
//     }
//   }, []);

//   // Fetch order details
//   useEffect(() => {
//     async function fetchOrderDetails() {
//       if (!transaction_id) {
//         setError("Invalid payment request. No order ID found.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/payment-requests/order/${transaction_id}`);
//         if (!response.ok) throw new Error("Failed to fetch order details.");
//         const data: Order = await response.json();

//         if (data && data.amount != null && data.razorpay_order_id) {
//           setOrder(data);
//           const savedAddress = localStorage.getItem("paymentAddress") || "";
//           setCustomerDetails({
//             customer_name: data.customer_name || "",
//             customer_email: data.customer_email || "",
//             customer_phone: data.customer_phone || "",
//             customer_address: savedAddress || data.customer_address || "",
//           });
//         } else {
//           setError("Order details not found.");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Error fetching order details.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrderDetails();
//   }, [transaction_id]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setCustomerDetails(prev => ({ ...prev, [name]: value }));
//   };

//   const paymentHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (!window.Razorpay) {
//       alert("Payment system not available. Please try again later.");
//       return;
//     }
//     if (!order || !transaction_id) {
//       alert("Order details not found.");
//       return;
//     }

//     const { customer_name, customer_email, customer_phone, customer_address } = customerDetails;

//     if (!customer_name || !customer_email || !customer_phone || !customer_address) {
//       alert("All customer details are required.");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(customer_email)) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     // Save address locally
//     try {
//       localStorage.setItem("paymentAddress", customer_address);
//     } catch (err) {
//       console.warn("Unable to save paymentAddress to localStorage", err);
//     }

//     // Update order with customer details on backend
//     try {
//       const response = await fetch(`${API_BASE_URL}/payment-requests/order/${transaction_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(customerDetails),
//       });

//       if (!response.ok) {
//         const body = await response.text().catch(() => null);
//         console.error("Failed to update customer details. Response:", response.status, body);
//         throw new Error("Failed to update customer details.");
//       }
//       const updatedOrder: Order = await response.json();
//       setOrder(updatedOrder);
//     } catch (err) {
//       console.error("Error updating customer details:", err);
//       alert("Failed to update customer details. Please try again.");
//       return;
//     }

//     // Prepare Razorpay options
//     const options: any = {
//       key: RAZORPAY_KEY,
//       amount: Math.round(order.amount * 100), // amount in paise
//       currency: "INR",
//       name: "My App",
//       description: "Payment Gateway",
//       order_id: order.razorpay_order_id,
//       prefill: { name: customer_name, email: customer_email, contact: customer_phone },
//       theme: { color: "#4f46e5" },
//       modal: {
//         ondismiss: () => {
//           const failureUrl = order.failure_url;
//           if (failureUrl) window.location.href = `${failureUrl}?transactionId=${transaction_id}`;
//         },
//       },
//       handler: function (response: any) {
//         const successUrl = order.success_url;
//         if (successUrl) window.location.href = `${successUrl}?transactionId=${transaction_id}`;
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.on("payment.failed", (response: any) => {
//       const failureUrl = order.failure_url;
//       if (failureUrl) window.location.href = `${failureUrl}?transactionId=${transaction_id}`;
//       else alert("Payment failed. Please try again.");
//     });

//     rzp.open();
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
//       <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Complete Your Payment</h1>

//       {loading && <p className="text-center text-gray-500">Loading order details...</p>}
//       {error && <p className="text-center text-red-500">{error}</p>}

//       {order && (
//         <form className="space-y-4">
//           <div className="text-center mb-4">
//             <p className="text-lg text-gray-700">
//               Order ID: <span className="font-medium">{transaction_id}</span>
//             </p>
//             <p className="text-xl font-semibold text-indigo-600">Amount: ₹{order.amount}</p>
//           </div>

//           <div className="space-y-3">
//             {["customer_name", "customer_email", "customer_phone"].map((field) => (
//               <div key={field}>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">{field.replace("customer_", "").toUpperCase()}</label>
//                 <input
//                   type={field === "customer_email" ? "email" : "text"}
//                   name={field}
//                   value={(customerDetails as any)[field]}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder={`Enter your ${field.replace("customer_", "")}`}
//                 />
//               </div>
//             ))}

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
//               <textarea
//                 name="customer_address"
//                 value={customerDetails.customer_address}
//                 onChange={handleInputChange}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
//                 placeholder="Enter your address"
//               />
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={paymentHandler}
//             className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
//           >
//             Pay Now 💳
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Product;

'use client';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Order {
  amount: number;
  razorpay_order_id: string;
  success_url: string;
  failure_url: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
}

interface CustomerDetails {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://ec2-13-234-30-113.ap-south-1.compute.amazonaws.com:3000";
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_bgUFcUzfDPatTa";

const Product: React.FC = () => {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
  });

  // Get transactionId on client
  useEffect(() => {
    const params = useSearchParams();
    const tid = params?.get("transactionId");
    setTransactionId(tid);
  }, []);

  // Load Razorpay checkout script
  useEffect(() => {
    const id = "razorpay-checkout-script";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Fetch order details
  useEffect(() => {
    async function fetchOrderDetails() {
      if (!transactionId) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/payment-requests/order/${transactionId}`);
        if (!response.ok) throw new Error("Failed to fetch order details.");
        const data: Order = await response.json();

        if (data && data.amount != null && data.razorpay_order_id) {
          setOrder(data);
          const savedAddress = localStorage.getItem("paymentAddress") || "";
          setCustomerDetails({
            customer_name: data.customer_name || "",
            customer_email: data.customer_email || "",
            customer_phone: data.customer_phone || "",
            customer_address: savedAddress || data.customer_address || "",
          });
        } else {
          setError("Order details not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching order details.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [transactionId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const paymentHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!window.Razorpay) {
      alert("Payment system not available. Please try again later.");
      return;
    }
    if (!order || !transactionId) {
      alert("Order details not found.");
      return;
    }

    const { customer_name, customer_email, customer_phone, customer_address } = customerDetails;

    if (!customer_name || !customer_email || !customer_phone || !customer_address) {
      alert("All customer details are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(customer_email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Save address locally
    try {
      localStorage.setItem("paymentAddress", customer_address);
    } catch (err) {
      console.warn("Unable to save paymentAddress to localStorage", err);
    }

    // Update order with customer details on backend
    try {
      const response = await fetch(`${API_BASE_URL}/payment-requests/order/${transactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerDetails),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => null);
        console.error("Failed to update customer details. Response:", response.status, body);
        throw new Error("Failed to update customer details.");
      }
      const updatedOrder: Order = await response.json();
      setOrder(updatedOrder);
    } catch (err) {
      console.error("Error updating customer details:", err);
      alert("Failed to update customer details. Please try again.");
      return;
    }

    // Prepare Razorpay options
    const options: any = {
      key: RAZORPAY_KEY,
      amount: Math.round(order.amount * 100),
      currency: "INR",
      name: "My App",
      description: "Payment Gateway",
      order_id: order.razorpay_order_id,
      prefill: { name: customer_name, email: customer_email, contact: customer_phone },
      theme: { color: "#4f46e5" },
      modal: {
        ondismiss: () => {
          const failureUrl = order.failure_url;
          if (failureUrl) window.location.href = `${failureUrl}?transactionId=${transactionId}`;
        },
      },
      handler: function () {
        const successUrl = order.success_url;
        if (successUrl) window.location.href = `${successUrl}?transactionId=${transactionId}`;
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      const failureUrl = order.failure_url;
      if (failureUrl) window.location.href = `${failureUrl}?transactionId=${transactionId}`;
      else alert("Payment failed. Please try again.");
    });

    rzp.open();
  };

  if (transactionId === null) return <p className="text-center mt-10">Loading payment details...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Complete Your Payment</h1>

      {loading && <p className="text-center text-gray-500">Loading order details...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {order && (
        <form className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">
              Order ID: <span className="font-medium">{transactionId}</span>
            </p>
            <p className="text-xl font-semibold text-indigo-600">Amount: ₹{order.amount}</p>
          </div>

          <div className="space-y-3">
            {["customer_name", "customer_email", "customer_phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{field.replace("customer_", "").toUpperCase()}</label>
                <input
                  type={field === "customer_email" ? "email" : "text"}
                  name={field}
                  value={(customerDetails as any)[field]}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter your ${field.replace("customer_", "")}`}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
              <textarea
                name="customer_address"
                value={customerDetails.customer_address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter your address"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={paymentHandler}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Pay Now 💳
          </button>
        </form>
      )}
    </div>
  );
};

export default Product;
