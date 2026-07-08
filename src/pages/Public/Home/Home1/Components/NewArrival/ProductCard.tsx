import { Star, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/Slices/wishlistSlice";
import { openWishlist } from "@/store/Slices/UISlice";
import { RootState } from "@/store/store";
import { Card, CardBody, Chip } from "@heroui/react";

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  rating?: number;
  reviews?: number;
  purchases?: string | number;
  badges?: string[];
  promotion?: {
    text: string[];
    expiry: string;
    image?: string;
  };
  isLarge?: boolean;
  className?: string;
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  rating = 0,
  reviews = 0,
  purchases,
  badges = [],
  promotion,
  isLarge = false,
  className = "",
  product,
}) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
    }
  };

  return (
    <Card
      className={`group relative h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-none hover:shadow-lg transition-all duration-500 rounded-xl overflow-hidden ${className}`}
    >
      <Link to={`/product/${id}`} className="flex flex-col h-full">
        <CardBody className="p-0 overflow-visible flex flex-col h-full">
          {isLarge ? (
            /* LARGE CARD LAYOUT */
            <div className="flex flex-col h-full">
              <div className="flex flex-row p-6 gap-6">
                {/* Left: Image */}
                <div className="relative w-36 h-44 flex-shrink-0 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl flex items-center justify-center p-4">
                  <div className="absolute top-3 left-3 flex flex-row gap-1.5 z-10">
                    {badges.map((badge, idx) => (
                      <Chip
                        key={idx}
                        size="sm"
                        className="bg-brand-600 text-white text-[9px] uppercase font-bold px-2.5 h-6 min-w-fit border-none"
                      >
                        {badge}
                      </Chip>
                    ))}
                  </div>
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Right: Details */}
                <div className="flex flex-col flex-1 py-1">
                  <h3 className="font-bold text-[#0F172A] dark:text-slate-100 text-[15px] leading-snug mb-2 line-clamp-2">
                    {title}
                  </h3>

                  <div className="flex items-center gap-1 mb-6">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${i < Math.floor(rating) ? "fill-[#FACC15] text-[#FACC15]" : "text-gray-200 dark:text-slate-700"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      ({reviews})
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="text-2xl font-black text-brand-700 dark:text-brand-200 mb-4">
                      ৳{price}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {purchases} Purchases
                      </span>
                      <Heart
                        size={18}
                        onClick={handleWishlist}
                        className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"} stroke-[1.5px] cursor-pointer hover:text-red-500 transition-colors`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Promotion Box */}
              {promotion && (
                <div className="mt-auto px-6 pb-6">
                  <div className="border-t border-gray-100 pt-6">
                    <div className="bg-[#FAF4E8] dark:bg-amber-950/20 dark:border dark:border-amber-900/20 rounded-xl p-5 flex gap-5 items-center">
                      {promotion.image && (
                        <div className="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center">
                          <img
                            src={promotion.image}
                            alt="gift"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="space-y-1.5">
                          {promotion.text.map((line, i) => (
                            <p
                              key={i}
                              className="text-[13px] font-bold text-brand-700 dark:text-brand-200 flex items-start gap-1.5"
                            >
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-black dark:bg-slate-300 flex-shrink-0" />
                              <span>
                                {line.split(/(\d+)/).map((part, index) =>
                                  /\d+/.test(part) ? (
                                    <span
                                      key={index}
                                      className="text-[#FF4D4D]"
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    part
                                  ),
                                )}
                              </span>
                            </p>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-4">
                          Promotion will expires soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* REGULAR CARD LAYOUT */
            <div className="flex flex-col h-full p-5 border border-gray-50 dark:border-slate-800 rounded-xl">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gray-50/50 dark:bg-slate-800/30 mb-4 rounded-lg flex items-center justify-center p-0">
                  <img
                    src={image}
                    alt={title}
                    className="aspect-square rounded-lg group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-[#0F172A] dark:text-slate-100 text-sm leading-tight mb-4 line-clamp-2">
                  {title}
                </h3>
                <div className="mt-auto flex items-center justify-between w-full">
                  <div className="text-xl font-black text-brand-700 dark:text-brand-200">
                    ৳{price}
                  </div>
                  <Heart
                    size={18}
                    onClick={handleWishlist}
                    className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"} stroke-[1.5px] cursor-pointer hover:text-red-500 transition-colors`}
                  />
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Link>
    </Card>
  );
};

export default ProductCard;
