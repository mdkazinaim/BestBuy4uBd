// Banner data types
export interface BannerData {
  id: string;
  type: "hero" | "product" | "feature" | "promotional";
  title?: string;
  subtitle?: string;
  description?: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  bgColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  textPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  titleSize?: string;
  subtitleSize?: string;
  showButton?: boolean;
  showTitle?: boolean;
  size: "small" | "medium" | "large";
  image?: string;
}

export interface BannerGridData {
  heroBanner: BannerData;
  productCards: BannerData[];
}
