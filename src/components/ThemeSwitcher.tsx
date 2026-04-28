import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Check, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Re-export specific Theme type if needed, but context handles it.

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, themes, changeTheme } = useTheme();

  return (
    <div className="fixed right-8 bottom-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl p-4 w-56 ring-1 ring-slate-900/5 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-brand-600" />
                <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-[0.2em]">
                  Appearance
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => changeTheme(theme.id)}
                    className={`group w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-300 border ${
                      currentTheme.id === theme.id
                        ? "bg-white border-slate-200 shadow-sm ring-1 ring-slate-100"
                        : "bg-transparent border-transparent hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-4 w-4 rounded-full shadow-inner ring-2 ring-white"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          currentTheme.id === theme.id
                            ? "text-slate-900"
                            : "text-slate-500 group-hover:text-slate-700"
                        }`}
                      >
                        {theme.name}
                      </span>
                    </div>
                    {currentTheme.id === theme.id && (
                      <motion.div
                        layoutId="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={14} className="text-brand-600" />
                      </motion.div>
                    )}
                  </button>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between px-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                Active Theme
              </span>
              <div className="px-2 py-0.5 bg-brand-50 rounded-md">
                <span className="text-[10px] font-bold text-brand-700 uppercase">
                  {currentTheme.id}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group relative overflow-hidden border border-white/20 ${
          isOpen ? "bg-slate-900" : "bg-brand-600"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Palette
          size={24}
          className={`text-white transition-transform duration-500 ${isOpen ? "rotate-12 scale-110" : ""}`}
        />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-200 border-2 border-brand-600"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};
