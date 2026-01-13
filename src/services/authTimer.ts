let refreshTimer: NodeJS.Timeout | null = null;
const REFRESH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;

export const startTokenRefreshTimer = () => {
  console.log("🔄 Starting token refresh timer");

  // Prevent multiple timers
  if (refreshTimer) return;

  refreshTimer = setInterval(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("No refresh token found — skipping refresh");
        return;
      }

      const res = await fetch(REFRESH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        console.warn("Token refresh failed — user NOT logged out");
        return;
      }

      const data = await res.json();

      // Update tokens silently
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      console.log("✅ Tokens refreshed silently");
    } catch (err) {
      console.warn("Token refresh error — ignored", err);
    }
  }, 10 * 60 * 1000); // every 10 minutes
};

export const cancelTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  console.log("⏹️ Token refresh timer canceled");
};



// let refreshTimer: NodeJS.Timeout | null = null;
// const REFRESH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;


// export const startTokenRefreshTimer = () => {
//   console.log("🔄 Starting token refresh timer");

//   refreshTimer = setInterval(async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       if (!refreshToken) throw new Error("No refresh token found");

//       console.log("🔄 Attempting to refresh token:", refreshToken);

//       const res = await fetch(REFRESH_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (!res.ok) {
//         alert("⚠️ Session expired. Please login again."); // <-- Add this
//         localStorage.clear();
//         window.location.href = "/auth/login";
//         return;
//       }

//       const data = await res.json();
//       console.log("✅ Tokens refreshed successfully:", data);

//       // Save new tokens
//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("refreshToken", data.refreshToken);
//     } catch (err) {
//       alert("⚠️ Session expired. Please login again."); // <-- Add this
//       console.error("❌ Token refresh failed:", err);
//       localStorage.clear();
//       window.location.href = "/auth/login";
//     }
//   }, 10 * 60 * 1000); // every 10 minutes
// };

// export const cancelTokenRefreshTimer = () => {
//   if (refreshTimer) clearInterval(refreshTimer);
//   console.log("⏹️ Token refresh timer canceled");
// };
