import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme as useBrandTheme } from "@/context/ThemeContext";
import { useTheme as useDarkTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, themes, changeTheme } = useBrandTheme();
  const { theme, setTheme } = useDarkTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme Settings"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-755 dark:text-slate-200 transition-all cursor-pointer focus:outline-none"
      >
        <Palette className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-12" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 z-[60] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 w-56 overflow-hidden shadow-lg shadow-slate-200/40 dark:shadow-none"
          >
            {/* Header */}
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Theme Settings
              </span>
            </div>

            {/* Dark Mode Toggle Switch */}
            <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all mb-2 cursor-pointer" onClick={() => setTheme(isDark ? "light" : "dark")}>
              <div className="flex items-center gap-2.5">
                {isDark ? (
                  <Moon className="w-4 h-4 text-blue-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Dark Mode
                </span>
              </div>
              <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${isDark ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${isDark ? "translate-x-3.5" : "translate-x-0"}`} />
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

            {/* Brand Colors Title */}
            <div className="px-1 mb-2">
              <span className="text-[9px] font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Brand Accent Color
              </span>
            </div>

            {/* Brand Accent Grid */}
            <div className="grid grid-cols-1 gap-0.5">
              {themes.map((t) => {
                const isActive = currentTheme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      changeTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2 py-1.5 rounded-lg flex items-center justify-between transition-all text-left border ${
                      isActive
                        ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-3.5 w-3.5 rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span
                        className={`text-xs font-semibold truncate ${
                          isActive
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {t.name}
                      </span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
