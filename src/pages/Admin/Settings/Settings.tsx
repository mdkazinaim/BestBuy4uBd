import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Plus, Trash2, Check, Palette, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/common/Components/Button";

// Color utilities
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};
const mix = (c1: any, c2: any, weight: number) => ({
  r: Math.round(c1.r * (1 - weight) + c2.r * weight),
  g: Math.round(c1.g * (1 - weight) + c2.g * weight),
  b: Math.round(c1.b * (1 - weight) + c2.b * weight),
});
const rgbToHex = (c: any) => "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
const generateShades = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  return {
    "--brand-50": rgbToHex(mix(rgb, white, 0.95)),
    "--brand-100": rgbToHex(mix(rgb, white, 0.9)),
    "--brand-200": rgbToHex(mix(rgb, white, 0.7)),
    "--brand-500": hex,
    "--brand-600": rgbToHex(mix(rgb, black, 0.1)),
    "--brand-700": rgbToHex(mix(rgb, black, 0.3)),
    "--brand-shadow": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
  };
};

const inputClass = "w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100";

export default function Settings() {
  const { themes, currentTheme, changeTheme, addCustomTheme, deleteCustomTheme, setSiteDefault, isLoading } = useTheme();
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeColor, setNewThemeColor] = useState("#3b82f6");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newThemeName || !newThemeColor) return;
    const variables = generateShades(newThemeColor);
    if (!variables) return;
    const id = newThemeName.toLowerCase().replace(/\s+/g, "-");
    await addCustomTheme({ id, name: newThemeName, color: newThemeColor, class: "", variables });
    setNewThemeName("");
    setNewThemeColor("#3b82f6");
    setIsCreating(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-500" />
            <span>Theme Settings</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your store's brand colors and visual appearance
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Theme</span>
        </Button>
      </div>

      {/* Creation Form (Animated) */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-5 space-y-5"
          >
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-500" />
              Create Custom Theme
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Theme Name</label>
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="e.g. Midnight Blue"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Primary Color</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={newThemeColor}
                    onChange={(e) => setNewThemeColor(e.target.value)}
                    className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newThemeColor}
                    onChange={(e) => setNewThemeColor(e.target.value)}
                    className={`${inputClass} flex-1 uppercase font-mono`}
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
              <Button variant="outline" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handleCreate} disabled={isLoading || !newThemeName}>
                {isLoading ? "Creating..." : "Create Theme"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isActive = currentTheme.id === theme.id;
          return (
            <div
              key={theme.id}
              className={`border rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden transition-all ${
                isActive
                  ? "border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/15"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Color preview strip */}
              <div className="h-1.5 w-full" style={{ backgroundColor: theme.color }} />

              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                      style={{ backgroundColor: theme.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{theme.name}</h3>
                      <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-0.5">
                        {theme.class ? "Preset" : "Custom"}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-450 border border-blue-200/60 dark:border-blue-900/40 shrink-0">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-850">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changeTheme(theme.id)}
                    className="w-full justify-center"
                  >
                    Preview
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSiteDefault(theme.id)}
                      disabled={isLoading}
                      className="flex-1 justify-center"
                    >
                      Set as Default
                    </Button>
                    {!theme.class && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCustomTheme(theme.id)}
                        className="p-2 aspect-square flex items-center justify-center hover:border-red-500/30 hover:bg-red-50/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}