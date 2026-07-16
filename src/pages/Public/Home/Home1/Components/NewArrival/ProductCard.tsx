import { Star, Heart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/Slices/wishlistSlice";
import { openWishlist } from "@/store/Slices/UISlice";
import { RootState } from "@/store/store";
import { Card, CardBody, Chip } from "@heroui/react";
import { addToCart } from "@/store/Slices/CartSlice";

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
  const navigate = useNavigate();
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

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const numericPrice = parseFloat(String(price).replace(/,/g, ''));
    dispatch(addToCart({
      id: id,
      name: title,
      price: isNaN(numericPrice) ? 0 : numericPrice,
      image: image,
      quantity: 1
    }));
    navigate('/checkout');
  };

  return (
    <Card
      className={`group relative h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-none hover:shadow-lg transition-all duration-500 rounded-xl overflow-hidden ${className}`}
    >
      <CardBody className="p-0 overflow-visible flex flex-col h-full">
        {isLarge ? (
          /* LARGE CARD LAYOUT */
          <div className="flex flex-col h-full">
            <div className="flex flex-row p-3 sm:p-6 gap-3 sm:gap-6">
              {/* Left: Image */}
              <Link to={`/product/${id}`} className="block flex-shrink-0">
                <div className="relative w-24 h-32 sm:w-36 sm:h-44 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl flex items-center justify-center p-2 sm:p-4">
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-row gap-1.5 z-10">
                    {badges.map((badge, idx) => (
                      <Chip
                        key={idx}
                        size="sm"
                        className="bg-brand-600 text-white text-[8px] sm:text-[9px] uppercase font-bold px-1.5 sm:px-2.5 h-5 sm:h-6 min-w-fit border-none"
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
              </Link>

              {/* Right: Details */}
              <div className="flex flex-col flex-1 py-1">
                <Link to={`/product/${id}`} className="block hover:text-brand-600">
                  <h3 className="font-normal sm:font-bold text-[#0F172A] dark:text-slate-100 text-xs sm:text-[15px] leading-snug mb-1 sm:mb-2 line-clamp-2">
                    {title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2 sm:mb-6">
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
                  <div className="text-lg sm:text-2xl font-black text-brand-700 dark:text-brand-200 mb-2 sm:mb-4">
                    ৳{price}
                  </div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                      {purchases} Purchases
                    </span>
                    <Heart
                      size={18}
                      onClick={handleWishlist}
                      className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"} stroke-[1.5px] cursor-pointer hover:text-red-500 transition-colors`}
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-1.5 sm:gap-2 w-full relative z-20">
                    <button 
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-dark-blue dark:bg-slate-800 text-white rounded-md flex items-center justify-center hover:opacity-90 transition-colors shrink-0 cursor-pointer shadow-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/product/${id}`);
                      }}
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      className="flex-1 bg-secondary text-white rounded-md font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm py-1 sm:py-0"
                      onClick={handleOrderNow}
                    >
                      অর্ডার করুন
                    </button>
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
          <div className="flex flex-col h-full p-3 sm:p-4 border border-gray-50 dark:border-slate-800 rounded-xl">
            <div className="flex flex-col items-stretch text-left w-full h-full">
              <Link to={`/product/${id}`} className="block mb-2 sm:mb-4 w-full">
                <div className="bg-gray-50/50 dark:bg-slate-800/30 rounded-lg flex items-center justify-center p-0">
                  <img
                    src={image}
                    alt={title}
                    className="aspect-square rounded-lg group-hover:scale-102 transition-transform duration-500 w-full object-cover"
                  />
                </div>
              </Link>
              <Link to={`/product/${id}`} className="block hover:text-brand-600 mb-2 sm:mb-4 w-full">
                <h3 className="font-normal sm:font-semibold text-[#0F172A] dark:text-slate-100 text-xs sm:text-sm leading-tight line-clamp-2 min-h-[32px] sm:min-h-[40px]">
                  {title}
                </h3>
              </Link>
              <div className="mt-auto flex items-center justify-between w-full mb-2 sm:mb-3">
                <div className="text-base sm:text-xl font-black text-brand-700 dark:text-brand-200">
                  ৳{price}
                </div>
                <Heart
                  size={18}
                  onClick={handleWishlist}
                  className={`${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300"} stroke-[1.5px] cursor-pointer hover:text-red-500 transition-colors`}
                />
              </div>
              {/* Action Buttons */}
              <div className="flex gap-1.5 sm:gap-2 w-full mt-2 relative z-20">
                <button 
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-dark-blue dark:bg-slate-800 text-white rounded-md flex items-center justify-center hover:opacity-90 transition-colors shrink-0 cursor-pointer shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/product/${id}`);
                  }}
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  className="flex-1 bg-secondary text-white rounded-md font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm py-1.5 sm:py-0"
                  onClick={handleOrderNow}
                >
                  অর্ডার করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ProductCard;
