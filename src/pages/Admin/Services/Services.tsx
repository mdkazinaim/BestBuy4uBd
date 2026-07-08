import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Facebook, ExternalLink, Eye, EyeOff, Video,
  Search, LayoutDashboard, Code2, Trash2, Settings2, Plus,
  Truck, MessageCircle, X, Plug,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetTrackingSettingsQuery, useUpdateTrackingSettingsMutation } from "@/store/Api/TrackingApi";
import { Button } from "@/common/Components/Button";

const CustomModal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ type: "spring", stiffness: 380, damping: 26 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden z-10 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-5 overflow-y-auto max-h-[70vh] space-y-4">{children}</div>
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">{footer}</div>
      </motion.div>
    </div>,
    document.body
  );
};

const FormInput = ({ label, placeholder, register, name }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
    <input type="text" placeholder={placeholder} {...register(name)} className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100" />
  </div>
);

export default function Services() {
  const { data: trackingData, isLoading } = useGetTrackingSettingsQuery({});
  const [updateTracking, { isLoading: isUpdating }] = useUpdateTrackingSettingsMutation();
  const settings = trackingData?.data || {};
  const [isOpen, setIsOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const handleEdit = (serviceKey: string, currentVal: any) => {
    setActiveService(serviceKey);
    reset();
    if (serviceKey === "facebook") { setValue("facebookPixelId", currentVal?.facebookPixelId); setValue("facebookAccessToken", currentVal?.facebookAccessToken); }
    else if (serviceKey === "facebookChat") { setValue("facebookPageId", currentVal?.facebookPageId); }
    else if (serviceKey === "steadfast") { setValue("steadfastApiKey", currentVal?.steadfastApiKey); setValue("steadfastSecretKey", currentVal?.steadfastSecretKey); setValue("steadfastEnabled", currentVal?.steadfastEnabled); }
    else { setValue(serviceKey, currentVal); }
    setIsOpen(true);
  };

  const handleRemove = (key: string) => {
    toast.warning("Remove this integration? Tracking will stop immediately.", {
      position: "top-center",
      action: {
        label: "Remove",
        onClick: async () => {
          try {
            const payload: any = {};
            if (key === "facebook") { payload.facebookPixelId = ""; payload.facebookAccessToken = ""; }
            else if (key === "facebookChat") { payload.facebookPageId = ""; }
            else if (key === "steadfast") { payload.steadfastApiKey = ""; payload.steadfastSecretKey = ""; payload.steadfastEnabled = false; }
            else { payload[key] = ""; }
            await updateTracking(payload).unwrap();
            toast.success("Integration removed");
          } catch { toast.error("Failed to remove"); }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const onSubmit = async (data: any) => {
    try { await updateTracking(data).unwrap(); toast.success("Settings saved"); setIsOpen(false); }
    catch { toast.error("Failed to update settings"); }
  };

  const toggleVisibility = (key: string) => setShowKey((prev) => ({ ...prev, [key]: !prev[key] }));
  const maskValue = (value: string, key: string) => !value ? "" : showKey[key] ? value : value.slice(0, 4) + "••••••••";

  const integrations = [
    { key: "gtmId", title: "Google Tag Manager", desc: "Manage all your tags without editing code.", icon: <Code2 className="text-blue-600 w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30", link: "https://tagmanager.google.com/", idLabel: "Container ID" },
    { key: "googleAnalyticsId", title: "Google Analytics 4", desc: "Track website traffic and user behavior.", icon: <BarChart3 className="text-orange-500 w-5 h-5" />, iconBg: "bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30", link: "https://analytics.google.com/", idLabel: "Measurement ID" },
    { key: "facebook", title: "Facebook Pixel & CAPI", desc: "Track conversions and retarget users on Facebook.", icon: <Facebook className="text-blue-600 w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30", link: "https://business.facebook.com/", idLabel: "Pixel ID" },
    { key: "facebookChat", title: "Facebook Messenger", desc: "Enable Messenger live chat on your website.", icon: <MessageCircle className="text-blue-500 w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30", link: "https://www.facebook.com/business/help/1524587524402327", idLabel: "Page ID" },
    { key: "whatsappNumber", title: "WhatsApp Chat", desc: "Enable WhatsApp chat button for customers.", icon: <MessageCircle className="text-green-500 w-5 h-5" />, iconBg: "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30", link: "https://faq.whatsapp.com/", idLabel: "Phone (with 880)" },
    { key: "tiktokPixelId", title: "TikTok Pixel", desc: "Measure TikTok ad performance.", icon: <Video className="text-slate-700 dark:text-slate-300 w-5 h-5" />, iconBg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700", link: "https://ads.tiktok.com/", idLabel: "Pixel ID" },
    { key: "clarityId", title: "Microsoft Clarity", desc: "Heatmaps and session recordings.", icon: <Eye className="text-orange-500 w-5 h-5" />, iconBg: "bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30", link: "https://clarity.microsoft.com/", idLabel: "Project ID" },
    { key: "searchConsoleVerificationCode", title: "Search Console", desc: "Monitor your site's Google search presence.", icon: <Search className="text-green-600 w-5 h-5" />, iconBg: "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30", link: "https://search.google.com/search-console", idLabel: "Verification Code" },
    { key: "lookerStudioEmbedUrl", title: "Looker Studio", desc: "Embed your custom analytics dashboard.", icon: <LayoutDashboard className="text-indigo-600 w-5 h-5" />, iconBg: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30", link: "https://lookerstudio.google.com/", idLabel: "Embed URL" },
    { key: "steadfast", title: "Steadfast Courier", desc: "Automated shipping integration for Bangladesh.", icon: <Truck className="text-emerald-600 w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30", link: "https://stedfast.com.bd/", idLabel: "API Key" },
  ];

  if (isLoading) return <div className="flex justify-center py-16 text-sm font-medium text-slate-400">Loading integrations...</div>;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-slate-500" /><span>Services & Integrations</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Connect and manage third-party tools, trackers, and courier services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => {
          const isConfigured = item.key === "facebook" ? !!settings.facebookPixelId : item.key === "facebookChat" ? !!settings.facebookPageId : item.key === "steadfast" ? !!settings.steadfastApiKey : !!settings[item.key];
          const currentValue = item.key === "facebook" ? { facebookPixelId: settings.facebookPixelId, facebookAccessToken: settings.facebookAccessToken } : item.key === "facebookChat" ? { facebookPageId: settings.facebookPageId } : item.key === "steadfast" ? { steadfastApiKey: settings.steadfastApiKey, steadfastSecretKey: settings.steadfastSecretKey, steadfastEnabled: settings.steadfastEnabled } : settings[item.key];
          const displayValue = item.key === "facebook" ? settings.facebookPixelId : item.key === "facebookChat" ? settings.facebookPageId : item.key === "steadfast" ? settings.steadfastApiKey : settings[item.key];
          const maskKey = item.key === "facebook" ? "facebookPixelId" : item.key === "facebookChat" ? "facebookPageId" : item.key === "steadfast" ? "steadfastApiKey" : item.key;

          return (
            <div key={item.key} className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden flex flex-col">
              <div className="p-4 flex items-start gap-3 border-b border-slate-100 dark:border-slate-850">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${item.iconBg}`}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
                  <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-500 hover:underline mt-1 transition-colors">
                    Official Site <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${isConfigured ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60" : "bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-750"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {isConfigured ? "Active" : "Idle"}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                {isConfigured ? (
                  <>
                    <div className="flex items-center gap-2 bg-slate-50/60 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-semibold text-slate-400 block mb-0.5">{item.idLabel}</span>
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 block truncate">{maskValue(displayValue, maskKey)}</span>
                      </div>
                      <button type="button" onClick={() => toggleVisibility(maskKey)} className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer focus:outline-none transition-colors shrink-0">
                        {showKey[maskKey] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item.key, currentValue)} className="flex-1 flex items-center justify-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5" /><span>Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRemove(item.key)} className="p-2 aspect-square flex items-center justify-center hover:border-red-500/30 hover:bg-red-50/20">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-3 gap-3">
                    <p className="text-xs text-slate-400 font-medium">Not configured yet</p>
                    <Button variant="primary" size="sm" onClick={() => handleEdit(item.key, currentValue)} className="w-full flex items-center justify-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /><span>Setup Now</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isOpen && (
          <CustomModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={`Configure ${integrations.find((i) => i.key === activeService)?.title}`}
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
              </>
            }
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {activeService === "facebook" ? (
                <><FormInput label="Facebook Pixel ID" placeholder="123456789..." register={register} name="facebookPixelId" /><FormInput label="Access Token (CAPI)" placeholder="EAAG..." register={register} name="facebookAccessToken" /></>
              ) : activeService === "facebookChat" ? (
                <FormInput label="Page ID (Messenger)" placeholder="Page ID for Chat Plugin" register={register} name="facebookPageId" />
              ) : activeService === "steadfast" ? (
                <>
                  <FormInput label="API Key" placeholder="Enter your Steadfast API Key" register={register} name="steadfastApiKey" />
                  <FormInput label="Secret Key" placeholder="Enter your Steadfast Secret Key" register={register} name="steadfastSecretKey" />
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                    <input type="checkbox" {...register("steadfastEnabled")} className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                    <span>Enable Automation</span>
                  </label>
                </>
              ) : (
                <FormInput label={integrations.find((i) => i.key === activeService)?.idLabel || "Tracking ID"} placeholder="Paste your ID or Key here" register={register} name={activeService || ""} />
              )}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-400 font-medium">
                Copy the correct ID from your provider's dashboard before saving.
              </div>
            </form>
          </CustomModal>
        )}
      </AnimatePresence>
    </div>
  );
}
