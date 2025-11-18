let refreshTimer: NodeJS.Timeout | null = null;

// Replace with your actual backend refresh URL
const REFRESH_URL = "http://localhost:3000/auth/refresh";

export const startTokenRefreshTimer = () => {
  console.log("🔄 Starting token refresh timer");

  // Refresh every 10 minutes
  refreshTimer = setInterval(async () => {
    console.log("🔄 Attempting to refresh access token...");

    try {
      const res = await fetch(REFRESH_URL, {
        method: "POST",
        credentials: "include", // send cookies if refresh token is stored there
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`❌ Refresh failed: HTTP ${res.status}`);
        return;
      }

      // Attempt JSON parsing safely
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("❌ Failed to parse JSON from refresh response:", err);
        return;
      }

      console.log("✅ Access token refreshed successfully:", data);
    } catch (err) {
      console.error("❌ Refresh token request failed:", err);
    }
  }, 10 * 60 * 1000); // every 10 minutes
};

export const cancelTokenRefreshTimer = () => {
  if (refreshTimer) clearInterval(refreshTimer);
  console.log("⏹️ Token refresh timer canceled");
};
