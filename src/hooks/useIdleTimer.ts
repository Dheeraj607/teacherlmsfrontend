import { useState, useEffect } from "react";

let idleTimeout: NodeJS.Timeout | null = null;
let logoutCountdownInterval: NodeJS.Timeout | null = null;

export const useIdleTimer = (idleTime = 10 * 60 * 1000, logoutSeconds = 60) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(logoutSeconds);

  const resetTimer = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    if (logoutCountdownInterval) clearInterval(logoutCountdownInterval);

    setShowWarning(false);
    setCountdown(logoutSeconds);

    idleTimeout = setTimeout(() => {
      console.log("⚠️ User idle detected, starting logout countdown");
      setShowWarning(true);

      logoutCountdownInterval = setInterval(() => {
        setCountdown((prev) => {
          console.log(`⏳ Logout in: ${prev}s`);
          if (prev <= 1) {
            clearInterval(logoutCountdownInterval!);
            console.log("🔒 Logging out user due to inactivity");
            window.location.href = "/auth/login"; // redirect to login
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, idleTime);
  };

  useEffect(() => {
    resetTimer();

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      if (logoutCountdownInterval) clearInterval(logoutCountdownInterval);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);

  return { showWarning, countdown };
};
