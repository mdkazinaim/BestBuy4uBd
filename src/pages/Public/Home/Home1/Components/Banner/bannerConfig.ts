import { BannerGridData } from "./types";

// Main banner configuration - easily customizable
export const bannerConfig: BannerGridData = {
  // Large Hero Banner (Left side)
  heroBanner: {
    id: "hero-1",
    type: "hero",
    title: "Noise Cancelling Headphone",
    subtitle: "Boso Over-Ear Headphone",
    features: ["Wifi, Voice Assistant", "Low Latency Game Mode"],
    ctaText: "BUY NOW",
    ctaLink: "/products/headphones",
    bgColor: "bg-slate-400",
    textColor: "text-white",
    size: "large",
  },

  // Product Cards (Right side and bottom)
  productCards: [
    // Top Right - Smartwatch
    {
      id: "product-1",
      type: "product",
      brand: "XQMIA",
      title: "Sport Water Resistance Watch",
      ctaText: "SHOP NOW",
      ctaLink: "/products/smartwatch",
      bgColor: "bg-white",
      textColor: "text-dark-blue",
      size: "medium",
    },

    // Middle Right - Camera
    {
      id: "product-2",
      type: "product",
      brand: "OKODO",
      title: "HERO 11+ BLACK",
      price: "৳169",
      ctaText: "SHOP NOW",
      ctaLink: "/products/camera",
      bgColor: "bg-slate-900",
      textColor: "text-white",
      size: "medium",
    },

    // Bottom Left - Gaming Console
    {
      id: "product-3",
      type: "product",
      title: "Sono Playgo 5",
      price: "৳569",
      ctaText: "DISCOVER NOW",
      ctaLink: "/products/gaming",
      bgColor: "bg-slate-100",
      textColor: "text-dark-blue",
      size: "small",
    },

    // Bottom Middle - Keyboard
    {
      id: "product-4",
      type: "feature",
      title: "Logitek Bluetooth Keyboard",
      subtitle: "Best for all device",
      ctaText: "VIEW PRODUCT",
      ctaLink: "/products/keyboard",
      bgColor: "bg-slate-500",
      textColor: "text-white",
      size: "small",
    },
  ],
};
