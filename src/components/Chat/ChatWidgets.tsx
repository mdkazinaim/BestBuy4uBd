import { useGetTrackingSettingsQuery } from "@/store/Api/TrackingApi";

const ChatWidgets = () => {
  const { data: trackingResponse } = useGetTrackingSettingsQuery({});
  const trackingSettings = trackingResponse?.data || {};

  // Fetch whatsapp and messenger from tracking settings (configured in the Services dashboard)
  const rawWhatsApp = trackingSettings.whatsappNumber || "";
  const rawMessenger = trackingSettings.facebookPageId || "";

  // Helpers to clean and format links
  const formatWhatsAppNumber = (num: string) => {
    // Remove all non-digits
    const clean = num.replace(/\D/g, "");
    if (!clean) return "";
    // If it starts with "01" (local BD number), prepend country code "88"
    if (clean.startsWith("01") && clean.length === 11) {
      return `88${clean}`;
    }
    return clean;
  };

  const formatMessengerLink = (val: string) => {
    if (!val) return "";
    if (val.startsWith("http")) {
      return val;
    }
    return `https://m.me/${val}`;
  };

  const whatsAppNumber = formatWhatsAppNumber(rawWhatsApp);
  const messengerLink = formatMessengerLink(rawMessenger);

  if (!whatsAppNumber && !messengerLink) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3.5 items-end">
      {/* Facebook Messenger Floating Button */}
      {messengerLink && (
        <a
          href={messengerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] transition-all hover:scale-110 active:scale-95 duration-200 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 group relative"
          title="Chat on Messenger"
        >
          <svg
            className="w-6 h-6 md:w-7 md:h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.91 1.45 5.51 3.73 7.2v3.35c0 .24.26.4.47.28l3.74-2.1c.66.18 1.35.28 2.06.28 5.52 0 10-4.14 10-9.25S17.52 2 12 2zm1.25 12-2.5-2.67-4.88 2.67 5.38-5.72 2.58 2.67 4.79-2.67-5.37 5.72z" />
          </svg>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
            Chat on Messenger
          </span>
        </a>
      )}

      {/* WhatsApp Floating Button */}
      {whatsAppNumber && (
        <a
          href={`https://wa.me/${whatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all hover:scale-110 active:scale-95 duration-200 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 group relative"
          title="Chat on WhatsApp"
        >
          <svg
            className="w-6 h-6 md:w-7 md:h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.99L2 22l5.135-1.347a9.94 9.94 0 004.87 1.287h.005c5.505 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.924-7.065C17.189 3.037 14.683 2 12.012 2zm5.72 13.916c-.244.69-1.218 1.348-1.685 1.4-.469.053-.941.082-2.73-.62-2.285-.9-3.719-3.211-3.832-3.361-.112-.15-.918-1.207-.918-2.297 0-1.09.575-1.625.78-1.839.202-.213.447-.268.594-.268a.434.434 0 01.412.268c.174.425.596 1.458.647 1.564.053.106.088.23.018.373-.07.142-.106.23-.213.355-.106.124-.224.277-.32.373-.106.106-.217.222-.093.435.124.213.55 1.077 1.18 1.64.811.724 1.493.948 1.706 1.054.213.106.337.089.462-.053.125-.142.533-.62.675-.833.14-.213.284-.177.479-.106.196.07 1.237.585 1.45.69.213.106.355.16.408.25.053.088.053.513-.191 1.203z" />
          </svg>
          {/* Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
            Chat on WhatsApp
          </span>
        </a>
      )}
    </div>
  );
};

export default ChatWidgets;
