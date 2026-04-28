import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Plus, Trash2, Check, Palette } from "lucide-react";

// Simple helper to generate shades (very basic implementation)
// In a real app, use 'tinycolor2' or 'colord'
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// naive mix with white/black
const mix = (c1: any, c2: any, weight: number) => {
    return {
        r: Math.round(c1.r * (1 - weight) + c2.r * weight),
        g: Math.round(c1.g * (1 - weight) + c2.g * weight),
        b: Math.round(c1.b * (1 - weight) + c2.b * weight)
    };
}

const rgbToHex = (c: any) => {
    return "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
}

const generateShades = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };

    return {
        '--brand-50': rgbToHex(mix(rgb, white, 0.95)),
        '--brand-100': rgbToHex(mix(rgb, white, 0.9)),
        '--brand-200': rgbToHex(mix(rgb, white, 0.7)),
        '--brand-500': hex,
        '--brand-600': rgbToHex(mix(rgb, black, 0.1)),
        '--brand-700': rgbToHex(mix(rgb, black, 0.3)),
        '--brand-shadow': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
    };
}

const Settings = () => {
  const { themes, currentTheme, changeTheme, addCustomTheme, deleteCustomTheme, setSiteDefault, isLoading } = useTheme();
  
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeColor, setNewThemeColor] = useState("#000000");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newThemeName || !newThemeColor) return;
    
    const variables = generateShades(newThemeColor);
    if (!variables) return;

    // simplistic ID generation
    const id = newThemeName.toLowerCase().replace(/\s+/g, '-');
    
    await addCustomTheme({
        id,
        name: newThemeName,
        color: newThemeColor,
        class: "", // custom themes don't have preset classes
        variables
    });
    
    setNewThemeName("");
    setNewThemeColor("#000000");
    setIsCreating(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
          <p className="text-gray-500">Manage your store's appearance and brand colors</p>
        </div>
        <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
            <Plus size={18} />
            Add New Theme
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-4 fade-in duration-300">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="text-indigo-600" size={20} />
                Create Custom Theme
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
                    <input 
                        type="text" 
                        value={newThemeName}
                        onChange={(e) => setNewThemeName(e.target.value)}
                        placeholder="e.g. Midnight Blue"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex gap-4">
                        <input 
                            type="color" 
                            value={newThemeColor}
                            onChange={(e) => setNewThemeColor(e.target.value)}
                            className="h-10 w-20 rounded cursor-pointer"
                        />
                        <input 
                            type="text" 
                            value={newThemeColor}
                            onChange={(e) => setNewThemeColor(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                            maxLength={7}
                        />
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button 
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleCreate}
                    disabled={isLoading || !newThemeName}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Creating..." : "Create Theme"}
                </button>
            </div>
        </div>
      )}

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
            <div 
                key={theme.id}
                className={`relative bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    currentTheme.id === theme.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-gray-100'
                }`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-12 h-12 rounded-xl shadow-inner" 
                                style={{ backgroundColor: theme.color }}
                            />
                            <div>
                                <h3 className="font-bold text-gray-900">{theme.name}</h3>
                                <p className="text-xs text-gray-500">{theme.class ? 'Preset' : 'Custom'}</p>
                            </div>
                        </div>
                        {currentTheme.id === theme.id && (
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                <Check size={12} />
                                Active
                            </span>
                        )}
                    </div>
                    
                    <div className="space-y-3 mt-6">
                        <button 
                            onClick={() => changeTheme(theme.id)}
                            className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 transition"
                        >
                            Preview
                        </button>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setSiteDefault(theme.id)}
                                disabled={isLoading}
                                className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                            >
                                Set as Default
                            </button>
                            {!theme.class && ( // Only show delete for custom themes (no class)
                                <button 
                                    onClick={() => deleteCustomTheme(theme.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition"
                                    title="Delete Theme"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
export default Settings