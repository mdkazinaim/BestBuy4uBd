export type BrandConfig = {
  title: string;
  name?: string;
  logo: string;
  phone?: string;
  email?: string;
};

export const BRAND_CONFIG: Record<string, BrandConfig> = {
  "bestbuy4ubd.com": {
    title: "BestBuy4uBd",
    // name: "Best Buy 4uBd",
    logo: "/logos/bestbuy4ubd.png",
    phone: "01610403011",
    email: "support@bestbuy4ubd.com",
  },
  "www.bestbuy4ubd.com": {
    title: "BestBuy4uBd",
    // name: "Best Buy 4u Bd",
    logo: "/logos/bestbuy4ubd.png",
    phone: "01610403011",
    email: "support@bestbuy4ubd.com",
  },
  "topdealsbd.com": {
    title: "TopDealsBd",
    // name: "Top Deals Bd",
    logo: "/logos/topdealsbd.png",
    phone: "01610403011",
    email: "support@topdealsbd.com",
  },
  "www.topdealsbd.com": {
    title: "TopDealsBd",
    // name: "Top Deals Bd",
    logo: "/logos/topdealsbd.png",
    phone: "01610403011",
    email: "support@topdealsbd.com",
  },
};
