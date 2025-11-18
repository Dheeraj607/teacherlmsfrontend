"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { startTokenRefreshTimer } from "@/services/authTimer";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("🔴 AuthGuard — no accessToken");
      router.push("/");
      return;
    }

    console.log("🟢 AuthGuard — token found, starting refresh timer");
    startTokenRefreshTimer();
  }, []);

  return <>{children}</>;
}
