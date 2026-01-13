import { useState, useEffect } from "react";

let idleTimeout: NodeJS.Timeout | null = null;
let warningInterval: NodeJS.Timeout | null = null;

export const useIdleTimer = (
  idleTime = 60 * 60 * 1000, // 1 hour
  warningSeconds = 60
) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(warningSeconds);

  const resetTimer = () => {
    if (idleTimeout) clearTimeout(idleTimeout);
    if (warningInterval) clearInterval(warningInterval);

    setShowWarning(false);
    setCountdown(warningSeconds);

    idleTimeout = setTimeout(() => {
      console.log("⚠️ User idle detected (no auto logout)");

      setShowWarning(true);

      warningInterval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }, idleTime);
  };

  useEffect(() => {
    resetTimer();

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      if (warningInterval) clearInterval(warningInterval);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);

  return {
    showWarning, // optional UI warning
    countdown,   // optional countdown
    resetTimer,  // expose if needed
  };
};





// import { useState, useEffect } from "react";
// import { cancelTokenRefreshTimer } from "@/services/authTimer"; 
// let idleTimeout: NodeJS.Timeout | null = null;
// let logoutCountdownInterval: NodeJS.Timeout | null = null;

// export const useIdleTimer = (idleTime = 60 * 60 * 1000, logoutSeconds = 60) => {
//   const [showWarning, setShowWarning] = useState(false);
//   const [countdown, setCountdown] = useState(logoutSeconds);

//   const resetTimer = () => {
//     if (idleTimeout) clearTimeout(idleTimeout);
//     if (logoutCountdownInterval) clearInterval(logoutCountdownInterval);

//     setShowWarning(false);
//     setCountdown(logoutSeconds);

//     idleTimeout = setTimeout(() => {
//       console.log("⚠️ User idle detected, starting logout countdown");
//       setShowWarning(true);

//       logoutCountdownInterval = setInterval(() => {
//         setCountdown((prev) => {
//           console.log(`⏳ Logout in: ${prev}s`);
//           if (prev <= 1) {
//             clearInterval(logoutCountdownInterval!);

//             cancelTokenRefreshTimer();   // 🛑 stop refresh
//             localStorage.clear();        // 🧹 clear tokens

//             console.log("🔒 Logged out due to inactivity");
//             window.location.href = "/auth/login";
//             return 0;
//           }

//           return prev - 1;
//         });
//       }, 1000);
//     }, idleTime);
//   };


//   useEffect(() => {
//     resetTimer();

//     const events = ["mousemove", "keydown", "scroll", "touchstart"];
//     events.forEach((e) => window.addEventListener(e, resetTimer));

//     return () => {
//       if (idleTimeout) clearTimeout(idleTimeout);
//       if (logoutCountdownInterval) clearInterval(logoutCountdownInterval);
//       events.forEach((e) => window.removeEventListener(e, resetTimer));
//     };
//   }, []);

//   return { showWarning, countdown };
// };




// import { useState, useEffect, useRef } from "react";

// export const useIdleTimer = (
//   idleTime = 1 * 60 * 1000, // 1 minute inactivity
//   logoutSeconds = 10 // countdown seconds
// ) => {
//   const [showWarning, setShowWarning] = useState(false);
//   const [countdown, setCountdown] = useState(logoutSeconds);

//   const idleTimeout = useRef<NodeJS.Timeout | null>(null);
//   const countdownInterval = useRef<NodeJS.Timeout | null>(null);

//   const logoutUser = () => {
//     console.log("🔒 Logging out user due to inactivity");
//     localStorage.clear();
//     window.location.href = "/auth/login";
//   };

//   const startCountdown = () => {
//     setShowWarning(true);
//     setCountdown(logoutSeconds);

//     countdownInterval.current = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownInterval.current!);
//           logoutUser();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const resetTimer = () => {
//     // Reset timers
//     if (idleTimeout.current) clearTimeout(idleTimeout.current);
//     if (countdownInterval.current) clearInterval(countdownInterval.current);

//     setShowWarning(false);
//     setCountdown(logoutSeconds);

//     // Start idle timeout
//     idleTimeout.current = setTimeout(() => {
//       console.log("⚠️ User inactive, starting logout countdown");
//       startCountdown();
//     }, idleTime);
//   };

//   useEffect(() => {
//     // Attach events
//     const events = ["mousemove", "keydown", "scroll", "touchstart"];
//     events.forEach((e) => window.addEventListener(e, resetTimer));

//     // Start timer on mount
//     resetTimer();

//     return () => {
//       // Cleanup
//       if (idleTimeout.current) clearTimeout(idleTimeout.current);
//       if (countdownInterval.current) clearInterval(countdownInterval.current);
//       events.forEach((e) => window.removeEventListener(e, resetTimer));
//     };
//   }, []);

//   return { showWarning, countdown };
// };
