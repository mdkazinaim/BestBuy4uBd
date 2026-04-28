import { useEffect } from "react";
import { useGetTrackingSettingsQuery } from "@/store/Api/TrackingApi";
import { useLocation } from "react-router-dom";

const TrackingManager = () => {
  const { data: trackingData, isLoading } = useGetTrackingSettingsQuery({});
  const location = useLocation();

  useEffect(() => {
    // Initialize dataLayer immediately
    window.dataLayer = window.dataLayer || [];

    if (isLoading || !trackingData?.data) {
      return;
    }

    const settings = trackingData.data;

    // 0. Google Tag Manager (GTM)
    const gtmId =
      settings.gtmId ||
      (settings.googleAnalyticsId?.startsWith("GTM-")
        ? settings.googleAnalyticsId
        : null);

    // Google Tag (GT-) - specifically for newer tracking implementations
    const googleTagId = settings.googleAnalyticsId?.startsWith("GT-")
      ? settings.googleAnalyticsId
      : null;

    if (gtmId) {
      if (
        !document.querySelector(
          `script[src*="googletagmanager.com/gtm.js?id=${gtmId}"]`,
        )
      ) {
        const script = document.createElement("script");
        script.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
            `;
        document.head.appendChild(script);

        const noscript = document.createElement("noscript");
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
        iframe.height = "0";
        iframe.width = "0";
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
        noscript.appendChild(iframe);
        document.body.prepend(noscript);
      }

      // Track virtual pageview
      window.dataLayer.push({
        event: "pageview",
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }

    // 1. Google Analytics 4 (GA4) or Google Tag (GT-)
    const gaId =
      (settings.googleAnalyticsId?.startsWith("G-")
        ? settings.googleAnalyticsId
        : null) || googleTagId;

    if (gaId) {
      if (
        !document.querySelector(
          `script[src*="googletagmanager.com/gtag/js?id=${gaId}"]`,
        )
      ) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        const configScript = document.createElement("script");
        configScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
            `;
        document.head.appendChild(configScript);
      }

      if (window.gtag) {
        window.gtag("config", gaId, {
          page_path: location.pathname + location.search,
        });
      }
    }

    // 2. Facebook Pixel
    if (settings.facebookPixelId) {
      const pixelId = settings.facebookPixelId;
      if (!document.querySelector(`script[data-pixel-id="${pixelId}"]`)) {
        const fbScript = document.createElement("script");
        fbScript.setAttribute("data-pixel-id", pixelId);
        fbScript.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
           `;
        document.head.appendChild(fbScript);
      }
      // Track PageView on route change (basic SPA tracking)
      if (window.fbq) {
        window.fbq("track", "PageView");
      }
    }

    // 3. TikTok Pixel (Basic implementation)
    if (settings.tiktokPixelId) {
      const tiktokId = settings.tiktokPixelId;
      if (!document.querySelector(`script[data-tiktok-id="${tiktokId}"]`)) {
        const script = document.createElement("script");
        script.setAttribute("data-tiktok-id", tiktokId);
        script.innerHTML = `
                !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t.split(".").forEach(function(e){t=ttq,e.split(".").forEach(function(e){t=t[e]||(t[e]={})})}),t.methods.forEach(function(e){t[e]=function(){var n=Array.prototype.slice.call(arguments);t.queue.push([e,n])}})};ttq.setAndDefer(ttq,function(e){e=e||{};for(var n=0;n<ttq.methods.length;n++)ttq.setAndDefer(ttq,ttq.methods[n]);ttq.instance=function(e){var n=ttq._i[e]||[];return Object.keys(ttq).forEach(function(t){Object.defineProperty(n,t,{get:function(){return ttq[t]},set:function(e){ttq[t]=e}})}),n},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                ttq.load('${tiktokId}');
                ttq.page();
                }(window, document, 'ttq');
             `;
        document.head.appendChild(script);
      }
      if (window.ttq) {
        window.ttq.page();
      }
    }

    // 4. Microsoft Clarity
    if (settings.clarityId) {
      const clarityId = settings.clarityId;
      if (!document.querySelector(`script[data-clarity-id="${clarityId}"]`)) {
        const script = document.createElement("script");
        script.setAttribute("data-clarity-id", clarityId);
        script.innerHTML = `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
            `;
        document.head.appendChild(script);
      }
    }

    // 5. Google Search Console Verification
    if (settings.searchConsoleVerificationCode) {
      if (!document.querySelector('meta[name="google-site-verification"]')) {
        const meta = document.createElement("meta");
        meta.name = "google-site-verification";
        meta.content = settings.searchConsoleVerificationCode;
        document.head.appendChild(meta);
      }
    }
  }, [trackingData, location, isLoading]);

  return null;
};

// Add typescript global declarations for window
declare global {
  interface Window {
    fbq: any;
    ttq: any;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default TrackingManager;
