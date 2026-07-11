import { useGetSettingsQuery } from "@/store/Api/SettingsApi";

export type HostConfig = {
  title: string;
  name?: string;
  logo: string;
  phone: string;
  email: string;
};

export const useGetHost = (): HostConfig => {
  const { data: settingsResponse } = useGetSettingsQuery({});

  const adminInfo = settingsResponse?.data?.adminInfo;

  return {
    title: adminInfo?.siteName || "",
    name: adminInfo?.name || "",
    logo: adminInfo?.logo || "",
    phone: adminInfo?.contact || "",
    email: adminInfo?.email || "",
  };
};
