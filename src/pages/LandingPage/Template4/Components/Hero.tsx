import { useEffect, useRef } from "react";
import { Play, Sparkles, ArrowRight, Star } from "lucide-react";
import { Product } from "@/types/Product/Product";

interface HeroProps {
  product: Product;
  scrollToCheckout: () => void;
}

export default function Hero({ product, scrollToCheckout }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = heroRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const rating = product?.rating?.average || 4.8;
  const reviewCount = product?.rating?.count || 127;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 overflow-hidden"
    >
      {/* Decorative floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "5s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 ">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>সীমিত সময়ের অফার - দ্রুত অর্ডার করুন</span>
          </div>

          {/* Title */}
          <h1 className="reveal text-xl sm:text-2xl lg:text-4xl font-extrabold text-white leading-tight mb-6">
            <span className="block">{product?.basicInfo?.title}</span>
            <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-2xl text-transparent">
              {product?.basicInfo?.brand}
            </span>
          </h1>

          {/* Rating */}
          <div className="reveal flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-white/80 text-sm">
              {rating} ({reviewCount}+ রিভিউ)
            </span>
          </div>

          {/* Subtitle */}
          <p className="reveal text-lg sm:text-xl text-white/80 max-w-4xl mb-10 leading-relaxed">
            {product?.basicInfo?.description?.substring(0, 300)}...
          </p>

          {/* Product Image */}
          <div className="reveal relative w-full max-w-4xl mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent rounded-2xl z-10" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform hover:scale-105 transition-transform duration-500">
              <img
                src={product?.images[0]?.url}
                alt={product?.images[0]?.alt || product?.basicInfo?.title}
                className="w-full h-auto"
              />
              {/* Play button overlay for video products */}
              {product?.videos && product.videos.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all duration-300 group">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}
            </div>
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl -z-10" />
          </div>

          <div className="reveal flex flex-col items-center gap-4">
            <button
              onClick={scrollToCheckout}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
              <span>এখনই অর্ডার করুন</span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                ৳{product?.price?.discounted || product?.price?.regular}
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-white/60 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ফ্রি ডেলিভারি ঢাকার ভেতর
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
}
