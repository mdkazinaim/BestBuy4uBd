export interface TrackedEvent {
  id: string;
  event: string;
  timestamp: string;
  path: string;
  device: "Mobile" | "Tablet" | "Desktop";
  payload: Record<string, any>;
  user?: {
    name?: string;
    email?: string;
  };
}

const STORAGE_KEY = "website_tracked_events";
const MAX_EVENTS = 500;

function getDeviceType(): "Mobile" | "Tablet" | "Desktop" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

export const websiteTrackingService = {
  getEvents(): TrackedEvent[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read website tracking logs:", e);
      return [];
    }
  },

  logEvent(event: string, payload: Record<string, any> = {}) {
    if (typeof window === "undefined") return;

    try {
      const existing = this.getEvents();

      // Get logged in user if saved in localStorage or auth state
      let user: { name?: string; email?: string } | undefined = undefined;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          user = {
            name: parsed.name || parsed.first_name,
            email: parsed.email,
          };
        }
      } catch (e) {
        // ignore error
      }

      const newEvent: TrackedEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        event,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        device: getDeviceType(),
        payload,
        user,
      };

      const updated = [newEvent, ...existing].slice(0, MAX_EVENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Dispatch custom event for real-time subscribers
      window.dispatchEvent(
        new CustomEvent("website_event_logged", { detail: newEvent })
      );
    } catch (e) {
      console.error("Failed to log website tracking event:", e);
    }
  },

  clearEvents() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("website_event_logged"));
    } catch (e) {
      console.error("Failed to clear tracking events:", e);
    }
  },
};
