import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api/v1";
    }
  }
  return "https://spark-tech-server.vercel.app/api/v1";
};

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    // We only track actual customers, not administration panel activity
    const path = location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/staff")) {
      return;
    }

    // 1. Resolve or generate session token (persists as long as browser tab is open)
    let sessionToken = sessionStorage.getItem("visitor_session_token");
    if (!sessionToken) {
      sessionToken = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("visitor_session_token", sessionToken);
    }

    // 2. Resolve returning visitor status (persists across browser restarts)
    let isReturning = false;
    if (localStorage.getItem("visitor_seen")) {
      isReturning = true;
    } else {
      localStorage.setItem("visitor_seen", "true");
    }

    const sendHeartbeat = async () => {
      try {
        await fetch(`${getBaseUrl()}/visitor-tracking/heartbeat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionToken,
            page: path,
            pageTitle: document.title || "BestBuy Store",
            referrer: document.referrer || "",
            isReturning,
          }),
        });
      } catch (err) {
        // Fail silently in background
        console.debug("Heartbeat tracking failed:", err);
      }
    };

    // Trigger heartbeat immediately on route change
    sendHeartbeat();

    // Setup interval to keep reporting active status (every 15 seconds)
    const intervalId = setInterval(sendHeartbeat, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, [location.pathname]);

  return null;
}
