// services/auth.ts
import api from "./api"; // your axios instance

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    const { accessToken, refreshToken } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    console.log("✅ Tokens stored after login");
    return true;
  } catch (err) {
    console.error("❌ Login failed:", err);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  console.log("🛑 Logged out");
  window.location.href = "/";
};
