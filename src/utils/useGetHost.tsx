import { BRAND_CONFIG, BrandConfig } from "@/config/BuildConfig";

export const useGetHost = (): BrandConfig => {
  const host = window.location.hostname;

  return (
    BRAND_CONFIG[host] || {
      title: "BestBuy4uBd",
      logo: "/logos/bestbuy4ubd.png",
      phone: "01610403011",
      email: "support@bestbuy4ubd.com",
    }
  );
};
