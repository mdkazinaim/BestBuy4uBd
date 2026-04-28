import React from "react";
import { Button } from "@heroui/react";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedContainer from "@/common/Components/AnimatedContainer";

interface DynamicBannerProps {
  title: string;
  regularPrice: number;
  discountedPrice: number;
  onShopNow: () => void;
  backgroundImage?: string;
}

const DynamicBanner: React.FC<DynamicBannerProps> = ({
  title,
  regularPrice,
  discountedPrice,
  onShopNow,
  backgroundImage,
}) => {
  const hasDiscount = discountedPrice < regularPrice;
  const savingsPercent = hasDiscount
    ? Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
    : 0;

  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center">
      {/* Background with Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : "linear-gradient(135deg, #124e66 0%, #2e3944 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <AnimatedContainer
          direction="right"
          className="max-w-2xl text-white space-y-6"
        >
          <div className="space-y-2">
            {hasDiscount && (
              <div className="flex items-center gap-2 text-primary-green mb-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Limited Time Offer
                </span>
              </div>
            )}
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white drop-shadow-lg">
              {title}
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-200 font-medium max-w-lg drop-shadow-md">
            {hasDiscount
              ? `Grab yours now and save ${savingsPercent}% off the regular price. Premium quality guaranteed.`
              : "Experience the next level of innovation and style with our latest flagship product."}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              size="lg"
              color="primary"
              variant="shadow"
              endContent={
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              }
              onPress={onShopNow}
              className="bg-primary-green text-black font-bold h-14 px-8 text-lg rounded-lg hover:scale-105 transition-all group"
            >
              Shop Now
            </Button>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold font-mono">
                  ৳{discountedPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through decoration-red-500/50">
                    ৳{regularPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {hasDiscount && (
          <AnimatedContainer
            direction="left"
            delay={0.2}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-green blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center rotate-12 shadow-2xl">
                <span className="text-gray-200 text-sm font-bold uppercase tracking-tighter">
                  Save
                </span>
                <span className="text-5xl font-black text-primary-green">
                  {savingsPercent}%
                </span>
                <span className="text-gray-200 text-xs font-medium">
                  Extra Off
                </span>
              </div>
            </div>
          </AnimatedContainer>
        )}
      </div>

      {/* Interactive Floating Particles (CSS only) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-green rounded-full animate-ping" />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:1s]" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary-green rounded-full animate-pulse" />
      </div>
    </section>
  );
};

export default DynamicBanner;
