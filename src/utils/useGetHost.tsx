import { BRAND_CONFIG, BrandConfig } from "@/config/BuildConfig";
import { useGetSettingsQuery } from "@/store/Api/SettingsApi";

export const useGetHost = (): BrandConfig => {
  const host = window.location.hostname;
  const { data: settingsResponse } = useGetSettingsQuery({});

  const defaultBrand = BRAND_CONFIG[host] || {
    title: "BestBuy4uBd",
    logo: "/logos/bestbuy4ubd.png",
    phone: "01610403011",
    email: "support@bestbuy4ubd.com",
  };

  const adminInfo = settingsResponse?.data?.adminInfo;

  return {
    title: adminInfo?.siteName || defaultBrand.title,
    logo: defaultBrand.logo,
    phone: adminInfo?.contact || defaultBrand.phone,
    email: adminInfo?.email || defaultBrand.email,
  };
};
