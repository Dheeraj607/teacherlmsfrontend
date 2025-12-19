import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={fallbackStyles.container}>
          <div style={fallbackStyles.spinner} />
          <p style={fallbackStyles.text}>Confirming your payment...</p>
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}

const fallbackStyles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  spinner: {
    width: 48,
    height: 48,
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #16a34a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 24,
  },
  text: {
    fontSize: 18,
    color: "#4b5563",
  },
};

// Add the keyframes for the spinner animation
// (Next.js will inline this when needed)
const globalStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;