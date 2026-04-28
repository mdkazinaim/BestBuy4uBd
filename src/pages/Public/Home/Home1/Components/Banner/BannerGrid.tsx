import HeroBanner from "./HeroBanner";
import { useGetAllBannersQuery } from "../../../../../../store/Api/BannerApi";
import { BannerData } from "./types";
import { useMemo } from "react";
import ProductCard1 from "./ProductCard1";
import ProductCard2 from "./ProductCard2";

const getBackgroundColor = (index: number, type: string) => {
  if (type === "hero") return "bg-slate-900"; // Default hero bg
  const colors = ["bg-white", "bg-slate-900", "bg-slate-100", "bg-slate-500"];
  return colors[index % colors.length];
};

const getTextColor = (bgColor: string) => {
  return bgColor.includes("slate-900") || bgColor.includes("slate-500") || bgColor.includes("text-primary")
    ? "text-white"
    : "text-text-primary";
};

const BannerGrid = () => {
  const { data: bannerResponse, isLoading } = useGetAllBannersQuery();

  const { heroBanners, productCards } = useMemo(() => {
    const banners = bannerResponse?.data || [];
    const heroes: BannerData[] = [];
    const others: BannerData[] = [];

    banners.forEach((banner: any, index: number) => {
      const bgColor = getBackgroundColor(index, banner.type);
      const mapped: BannerData = {
        id: banner._id,
        type: (banner.type === "hero" || banner.type === "promotional" || banner.type === "product" || banner.type === "feature") 
          ? banner.type as "hero" | "promotional" | "product" | "feature" 
          : "product",
        title: banner.title,
        subtitle: banner.subtitle,
        description: banner.description,
        ctaText: banner.buttonText || "Shop Now",
        ctaLink: banner.link || "#",
        image: banner.image,
        bgColor: bgColor,
        textColor: banner.textColor || getTextColor(bgColor),
        buttonColor: banner.buttonBgColor,
        buttonTextColor: banner.buttonTextColor,
        textPosition: banner.textPosition,
        titleSize: banner.titleSize,
        subtitleSize: banner.subtitleSize,
        showButton: banner.showButton !== undefined ? banner.showButton : true,
        showTitle: banner.showTitle !== undefined ? banner.showTitle : true,
        size: banner.type === "hero" ? "large" : "medium",
        brand: "",
        price: "",
      };

      if (banner.type === "hero") {
        heroes.push(mapped);
      } else if (banner.type !== "promotional") {
        others.push(mapped);
      }
    });

    return { heroBanners: heroes, productCards: others };
  }, [bannerResponse]);

  const showSkeleton =
    isLoading || (heroBanners.length === 0 && productCards.length === 0);

  if (showSkeleton) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hero Skeleton */}
          <div className="lg:col-span-2 lg:row-span-2 h-[500px] bg-border-main/20 rounded-container animate-pulse" />

          {/* Right Column Skeleton */}
          <div className="space-y-6 h-[500px]">
            <div className="h-full bg-border-main/20 rounded-component animate-pulse" />
          </div>

          {/* Bottom Row Skeleton */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-[200px] bg-border-main/20 rounded-component animate-pulse" />
            <div className="h-[200px] bg-border-main/20 rounded-component animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 space-y-6 space-x-6">
        {/* Left Column - Large Hero Banner Carousel */}
        <div className="lg:col-span-2 lg:row-span-2 h-[500px] rounded-xl overflow-hidden">
          {heroBanners.length > 0 ? (
            <HeroBanner banners={heroBanners} />
          ) : (
            <div className="h-full bg-border-main/20 rounded-container animate-pulse" />
          )}
        </div>

        {/* Right Column - Top Right Product Card */}
        <div className="space-y-6 h-[500px] w-full">
          {productCards.length > 0 ? (
            <ProductCard1
              key={productCards[0].id}
              data={productCards[0]}
              index={0}
            />
          ) : (
            <div className="h-full bg-border-main/20 rounded-component animate-pulse" />
          )}
        </div>

        {/* Bottom Row - Remaining Product Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {productCards.length > 1 ? (
            productCards
              .slice(1)
              .map((card, index) => (
                <ProductCard2 key={card.id} data={card} index={index + 1} />
              ))
          ) : (
            <>
              <div className="h-[200px] bg-border-main/20 rounded-component animate-pulse" />
              <div className="h-[200px] bg-border-main/20 rounded-component animate-pulse" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerGrid;
