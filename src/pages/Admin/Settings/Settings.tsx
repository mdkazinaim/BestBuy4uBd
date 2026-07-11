import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Plus, Trash2, Palette, Settings as SettingsIcon, Save, Store, Mail, Phone, Clock, Info, User, Share2, Lock } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateAdminInfoMutation } from "@/store/Api/SettingsApi";
import { useChangePasswordMutation } from "@/store/Api/AuthApi";

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

const inputClass = "w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 transition-colors";
const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1.5";

export default function Settings() {
  const { themes, currentTheme, changeTheme, addCustomTheme, deleteCustomTheme, setSiteDefault, isLoading: themeLoading } = useTheme();
  
  // API Queries
  const { data: settingsResponse, isLoading: isSettingsLoading } = useGetSettingsQuery({});
  const [updateAdminInfo, { isLoading: isUpdating }] = useUpdateAdminInfoMutation();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    siteName: "",
    logo: "",
    information: "",
    contact: "",
    email: "",
    facebook: "",
    twitter: "",
    instagram: "",
    workingHours: ""
  });

  useEffect(() => {
    if (settingsResponse?.data?.adminInfo) {
      setAdminInfo({
        name: settingsResponse.data.adminInfo.name || "",
        siteName: settingsResponse.data.adminInfo.siteName || "",
        logo: settingsResponse.data.adminInfo.logo || "",
        information: settingsResponse.data.adminInfo.information || "",
        contact: settingsResponse.data.adminInfo.contact || "",
        email: settingsResponse.data.adminInfo.email || "",
        facebook: settingsResponse.data.adminInfo.facebook || "",
        twitter: settingsResponse.data.adminInfo.twitter || "",
        instagram: settingsResponse.data.adminInfo.instagram || "",
        workingHours: settingsResponse.data.adminInfo.workingHours || ""
      });
    }
  }, [settingsResponse]);

  const handleAdminInfoChange = (e: any) => {
    setAdminInfo({ ...adminInfo, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSaveAdminInfo = async () => {
    try {
      const formData = new FormData();
      Object.entries(adminInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      
      await updateAdminInfo(formData).unwrap();
      toast.success("Site information updated successfully");
      setLogoFile(null); // Reset logo file after successful upload
    } catch {
      toast.error("Failed to update site information");
    }
  };

  // Password change states
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handlePasswordChange = (e: any) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword(passwordData).unwrap();
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  // Theme states
  const [selectedThemeId, setSelectedThemeId] = useState(currentTheme?.id || "default");
  useEffect(() => {
    if (currentTheme?.id) setSelectedThemeId(currentTheme.id);
  }, [currentTheme]);

  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeColor, setNewThemeColor] = useState("#3b82f6");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTheme = async () => {
    if (!newThemeName || !newThemeColor) return;
    const variables = generateShades(newThemeColor);
    if (!variables) return;
    const id = newThemeName.toLowerCase().replace(/\s+/g, "-");
    await addCustomTheme({ id, name: newThemeName, color: newThemeColor, class: "", variables });
    setNewThemeName("");
    setNewThemeColor("#3b82f6");
    setIsCreating(false);
    toast.success("Custom theme created!");
  };

  const selectedTheme = themes.find(t => t.id === selectedThemeId);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">General Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
              Manage your site information, contact details, and brand theme
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Admin Info Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Site Information</h2>
              <Button variant="primary" size="sm" onClick={handleSaveAdminInfo} disabled={isUpdating} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            <div className="p-6">
              {isSettingsLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        <Store className="w-4 h-4" /> Site Name
                      </label>
                      <input type="text" name="siteName" value={adminInfo.siteName} onChange={handleAdminInfoChange} placeholder="Site Name" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <User className="w-4 h-4" /> Admin Name
                      </label>
                      <input type="text" name="name" value={adminInfo.name} onChange={handleAdminInfoChange} placeholder="e.g. John Doe" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Store className="w-4 h-4" /> Site Logo
                    </label>
                    <div className="flex items-center gap-4">
                      {adminInfo.logo && !logoFile && (
                        <img src={adminInfo.logo} alt="Logo" className="w-12 h-12 object-contain rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1" />
                      )}
                      {logoFile && (
                        <div className="w-12 h-12 flex items-center justify-center rounded border border-blue-200 bg-blue-50 text-blue-500 font-bold text-xs p-1 text-center overflow-hidden">
                          New
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleLogoChange} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <Info className="w-4 h-4" /> About Information
                    </label>
                    <textarea name="information" value={adminInfo.information} onChange={handleAdminInfoChange} rows={3} placeholder="Brief description about the site..." className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>
                        <Phone className="w-4 h-4" /> Contact Number
                      </label>
                      <input type="text" name="contact" value={adminInfo.contact} onChange={handleAdminInfoChange} placeholder="+880 1XXXXXXXXX" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <Mail className="w-4 h-4" /> Email Address
                      </label>
                      <input type="email" name="email" value={adminInfo.email} onChange={handleAdminInfoChange} placeholder="support@domain.com" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>
                        <Clock className="w-4 h-4" /> Working Hours
                      </label>
                      <input type="text" name="workingHours" value={adminInfo.workingHours} onChange={handleAdminInfoChange} placeholder="Mon-Fri, 9:00 AM - 6:00 PM" className={inputClass} />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-slate-500" /> Social Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="text" name="facebook" value={adminInfo.facebook} onChange={handleAdminInfoChange} placeholder="Facebook URL" className={inputClass} />
                      <input type="text" name="twitter" value={adminInfo.twitter} onChange={handleAdminInfoChange} placeholder="Twitter URL" className={inputClass} />
                      <input type="text" name="instagram" value={adminInfo.instagram} onChange={handleAdminInfoChange} placeholder="Instagram URL" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-6">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" /> Change Password
              </h2>
              <Button variant="primary" size="sm" onClick={handleSavePassword} disabled={isChangingPassword} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Theme Settings */}
        <div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-600" /> Appearance
              </h2>
            </div>
            
            <div className="p-6 space-y-6 flex-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Select an active theme for your storefront, or create a custom brand color.
              </p>

              <div>
                <label className={labelClass}>Select Theme</label>
                <div className="relative">
                  <select
                    value={selectedThemeId}
                    onChange={(e) => {
                      setSelectedThemeId(e.target.value);
                      changeTheme(e.target.value);
                    }}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {themes.map(t => (
                      <option key={t.id} value={t.id}>{t.name} {t.class ? '(Preset)' : '(Custom)'}</option>
                    ))}
                  </select>
                  {selectedTheme && (
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: selectedTheme.color }} />
                  )}
                </div>
              </div>

              {selectedTheme && (
                <div className="flex flex-col gap-3">
                  <Button variant="primary" onClick={() => setSiteDefault(selectedTheme.id)} disabled={themeLoading} className="w-full justify-center">
                    Set as Global Default
                  </Button>
                  {!selectedTheme.class && (
                    <Button variant="outline" onClick={() => {
                        deleteCustomTheme(selectedTheme.id);
                        setSelectedThemeId('default');
                    }} className="w-full justify-center text-red-600 hover:bg-red-50 hover:border-red-200 border-slate-200">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Theme
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800">
              {isCreating ? (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                    <input type="text" value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} placeholder="Custom Theme Name" className={inputClass} />
                    <div className="flex items-center gap-3">
                      <input type="color" value={newThemeColor} onChange={(e) => setNewThemeColor(e.target.value)} className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer" />
                      <input type="text" value={newThemeColor} onChange={(e) => setNewThemeColor(e.target.value)} className={inputClass} maxLength={7} />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" size="sm" onClick={() => setIsCreating(false)} className="flex-1 justify-center">Cancel</Button>
                      <Button variant="primary" size="sm" onClick={handleCreateTheme} disabled={!newThemeName} className="flex-1 justify-center">Create</Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <Button variant="outline" className="w-full justify-center border-dashed border-2 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Custom Color
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}