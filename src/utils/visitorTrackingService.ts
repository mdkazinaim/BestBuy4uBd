import { useState, useEffect } from "react";

const INITIAL_VISITOR_COUNT = 1;
const STORAGE_TOTAL_KEY = "site_total_visitors_count";
const SESSION_FLAG_KEY = "site_session_counted";

export const visitorTrackingService = {
  getTotalVisitors(): number {
    if (typeof window === "undefined") return INITIAL_VISITOR_COUNT;
    try {
      const stored = localStorage.getItem(STORAGE_TOTAL_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        return isNaN(parsed) ? INITIAL_VISITOR_COUNT : parsed;
      }
      return INITIAL_VISITOR_COUNT;
    } catch (e) {
      return INITIAL_VISITOR_COUNT;
    }
  },

  registerSessionVisit(): number {
    if (typeof window === "undefined") return INITIAL_VISITOR_COUNT;
    try {
      const current = this.getTotalVisitors();
      const hasCountedSession = sessionStorage.getItem(SESSION_FLAG_KEY);
      
      if (!hasCountedSession) {
        const next = current === 0 ? 1 : current + 1;
        localStorage.setItem(STORAGE_TOTAL_KEY, String(next));
        sessionStorage.setItem(SESSION_FLAG_KEY, "true");
        window.dispatchEvent(new CustomEvent("visitor_count_updated", { detail: next }));
        return next;
      }
      return current;
    } catch (e) {
      return INITIAL_VISITOR_COUNT;
    }
  },
};

export function useVisitorCount() {
  const [totalVisitors, setTotalVisitors] = useState<number>(() =>
    visitorTrackingService.getTotalVisitors()
  );

  useEffect(() => {
    // Increment visitor count if a new session
    const updatedCount = visitorTrackingService.registerSessionVisit();
    setTotalVisitors(updatedCount);

    const handleUpdate = (e: any) => {
      if (e.detail !== undefined) {
        setTotalVisitors(e.detail);
      } else {
        setTotalVisitors(visitorTrackingService.getTotalVisitors());
      }
    };

    window.addEventListener("visitor_count_updated", handleUpdate);
    return () => {
      window.removeEventListener("visitor_count_updated", handleUpdate);
    };
  }, []);

  return totalVisitors;
}
