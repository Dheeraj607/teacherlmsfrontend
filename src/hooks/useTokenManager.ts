import { useState, useEffect } from "react";

export const useTokenManager = () => {
  const [remaining, setRemaining] = useState(3600); // 10 minutes
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    setTokenReady(true);

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { remaining, tokenReady };
};
