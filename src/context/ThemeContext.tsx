import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export interface Theme {
  id: string;
  name: string;
  color: string;
  class: string;
  variables?: Record<string, string>;
}

export const defaultThemes: Theme[] = [
  {
    id: "default",
    name: "Indigo",
    color: "#6366f1",
    class: "",
    variables: {
      "--brand-50": "#eef2ff",
      "--brand-100": "#e0e7ff",
      "--brand-200": "#c7d2fe",
      "--brand-500": "#6366f1",
      "--brand-600": "#4f46e5",
      "--brand-700": "#4338ca",
      "--brand-shadow": "rgba(79, 70, 229, 0.15)",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    color: "#10b981",
    class: "theme-emerald",
    variables: {
      "--brand-50": "#ecfdf5",
      "--brand-100": "#d1fae5",
      "--brand-200": "#a7f3d0",
      "--brand-500": "#10b981",
      "--brand-600": "#059669",
      "--brand-700": "#047857",
      "--brand-shadow": "rgba(5, 150, 105, 0.15)",
    },
  },
  {
    id: "rose",
    name: "Rose",
    color: "#f43f5e",
    class: "theme-rose",
    variables: {
      "--brand-50": "#fff1f2",
      "--brand-100": "#ffe4e6",
      "--brand-200": "#fecdd3",
      "--brand-500": "#f43f5e",
      "--brand-600": "#e11d48",
      "--brand-700": "#be123c",
      "--brand-shadow": "rgba(225, 29, 72, 0.15)",
    },
  },
  {
    id: "violet",
    name: "Violet",
    color: "#8b5cf6",
    class: "theme-violet",
    variables: {
      "--brand-50": "#f5f3ff",
      "--brand-100": "#ede9fe",
      "--brand-200": "#ddd6fe",
      "--brand-500": "#8b5cf6",
      "--brand-600": "#7c3aed",
      "--brand-700": "#6d28d9",
      "--brand-shadow": "rgba(124, 58, 237, 0.15)",
    },
  },
  {
    id: "amber",
    name: "Amber",
    color: "#f59e0b",
    class: "theme-amber",
    variables: {
      "--brand-50": "#fffbeb",
      "--brand-100": "#fef3c7",
      "--brand-200": "#fde68a",
      "--brand-500": "#f59e0b",
      "--brand-600": "#d97706",
      "--brand-700": "#b45309",
      "--brand-shadow": "rgba(217, 119, 6, 0.15)",
    },
  },
];

export interface IThemeContext {
  currentTheme: Theme;
  themes: Theme[];
  changeTheme: (themeId: string) => void;
  addCustomTheme: (theme: any) => Promise<void>;
  deleteCustomTheme: (themeId: string) => Promise<void>;
  setSiteDefault: (themeId: string) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [currentThemeId, setCurrentThemeId] = useState<string>("default");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch site settings from backend (presets + custom themes)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Adjust URL based on your env
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/v1/settings`,
        );
        if (data?.success && data?.data) {
          const backendThemes = data.data.themes || [];
          // Merge or replace defaultThemes.
          // If backend has themes, use them (assuming backend is source of truth after init)
          if (backendThemes.length > 0) {
            // Map backend theme structure to frontend if slightly different,
            // but here we kept them identical in our implementation plan
            // We need to ensure we map 'previewColor' -> 'color' if mismatch
            const mappedThemes = backendThemes.map((t: any) => ({
              id: t.id,
              name: t.name,
              color: t.previewColor || t.color,
              class: t.className || "",
              variables: t.variables,
            }));
            setThemes(mappedThemes);
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme settings", error);
        // Fallback to defaultThemes is implicit via useState initial value
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Initialize active theme (User Preference > Site Default)
  useEffect(() => {
    const savedThemeId = localStorage.getItem("selected-theme");
    if (savedThemeId && themes.find((t) => t.id === savedThemeId)) {
      setCurrentThemeId(savedThemeId);
    } else {
      // Fallback to first theme or specific default
      // In a real app, backend settings would say which ID is "default"
      setCurrentThemeId("default");
    }
  }, [themes]);

  // 3. Apply Theme Effects (CSS Variables & Classes)
  useEffect(() => {
    const theme = themes.find((t) => t.id === currentThemeId) || themes[0];
    if (!theme) return;

    // Remove old preset classes
    document.body.classList.remove(
      ...themes.map((t) => t.class).filter(Boolean),
    );

    // Apply preset class if exists
    if (theme.class) {
      document.body.classList.add(theme.class);
    }

    // Always inject variables (for both presets AND custom themes if they carry overrides)
    // For Tailwind v4 variables inside @theme block, we might need to set standard CSS vars on :root
    // But since we are using CSS variables in our index.css config, rewriting them on root works
    if (theme.variables) {
      Object.entries(theme.variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
    }

    // Persist choice
    localStorage.setItem("selected-theme", currentThemeId);
  }, [currentThemeId, themes]);

  const changeTheme = async (themeId: string) => {
    // If Admin/logged in, we might want to save this to backend as "site default"
    // But for now, user preference is local, Admin preference is via separate "save as default" action?
    // User request: "admin can... set his sites theme color".
    // This implies creating a theme puts it in the list, and "setting" it makes it active for EVERYONE (Site Default).
    // So distinct actions: "Preview/Select Local" (changeTheme) vs "Set Site Default".

    // For now, let's keep changeTheme as local preview/selection.
    setCurrentThemeId(themeId);
  };

  const addCustomTheme = async (theme: Omit<Theme, "id">) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/v1/settings/theme`,
        theme,
      );
      if (data?.success && data?.data) {
        // actually backend returns full settings, we should re-map all
        const backendThemes = data.data.themes || [];
        const mappedThemes = backendThemes.map((t: any) => ({
          id: t.id,
          name: t.name,
          color: t.previewColor || t.color,
          class: t.className || "",
          variables: t.variables,
        }));
        setThemes(mappedThemes);
        toast.success("Theme added successfully");
      }
    } catch (error) {
      console.error("Failed to add theme", error);
      toast.error("Failed to add theme");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/v1/settings/theme/${themeId}`,
      );
      if (data?.success) {
        const backendThemes = data.data.themes || [];
        const mappedThemes = backendThemes.map((t: any) => ({
          id: t.id,
          name: t.name,
          color: t.previewColor || t.color,
          class: t.className || "",
          variables: t.variables,
        }));
        setThemes(mappedThemes);
        // if deleted was active, fallback
        if (currentThemeId === themeId) setCurrentThemeId("default");
        toast.success("Theme deleted");
      }
    } catch (error) {
      console.error("Failed to delete theme", error);
      toast.error("Failed to delete theme");
    } finally {
      setIsLoading(false);
    }
  };

  const setSiteDefault = async (themeId: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}/api/v1/settings/theme`,
        { themeId },
      );
      if (data?.success) {
        toast.success("Site default theme updated");
        // Here we might want to update local state to reflect this is the new default?
        // But local preference overrides default.
      }
    } catch (error) {
      console.error("Failed to set default", error);
      toast.error("Failed to set default");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentTheme: themes.find((t) => t.id === currentThemeId) || themes[0],
    themes,
    changeTheme,
    addCustomTheme,
    deleteCustomTheme,
    setSiteDefault,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
