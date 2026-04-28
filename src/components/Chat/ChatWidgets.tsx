import { useEffect } from "react";
import { useGetTrackingSettingsQuery } from "@/store/Api/TrackingApi";
import { MessageCircle } from "lucide-react";

declare global {
  interface Window {
    fbAsyncInit: any;
    FB: any;
  }
}

const ChatWidgets = () => {
  const { data: trackingData } = useGetTrackingSettingsQuery({});
  const settings = trackingData?.data || {};

  useEffect(() => {
    if (settings.facebookPageId) {
      // Setup chatbox attributes
      const chatbox = document.getElementById('fb-customer-chat');
      if (chatbox) {
        chatbox.setAttribute("page_id", settings.facebookPageId);
        chatbox.setAttribute("attribution", "biz_inbox");
      }

      // Initialize SDK
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml            : true,
          version          : 'v18.0'
        });
      };

      // Load SDK
      (function(d, s, id) {
        const fjs: any = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s) as any;
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, [settings.facebookPageId]);

  return (
    <>
      {/* WhatsApp Widget */}
      {settings.whatsappNumber && (
        <a
          href={`https://wa.me/${settings.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors hover:scale-110 transform duration-200 flex items-center justify-center"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}

      {/* Facebook Messenger Widget Container */}
      {settings.facebookPageId && (
        <>
            <div id="fb-root"></div>
            <div id="fb-customer-chat" className="fb-customerchat"></div>
        </>
      )}
    </>
  );
};

export default ChatWidgets;
