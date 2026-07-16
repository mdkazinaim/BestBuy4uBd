import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { ProductData } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/Slices/wishlistSlice";
import { openWishlist } from "@/store/Slices/UISlice";
import { RootState } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "@/store/Slices/CartSlice";

interface ProductCardProps {
  product: ProductData;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some(item => item._id === product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      const wishlistItem = {
        _id: product.id,
        basicInfo: { title: product.title },
        price: { regular: product.price, discounted: product.price },
        images: [{ url: product.image }],
        category: product.category,
        rating: { average: product.rating, count: product.reviews }
      };
      dispatch(addToWishlist(wishlistItem));
      dispatch(openWishlist());
    }
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
    navigate('/checkout');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-container bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-3 sm:p-4 flex flex-col group h-full relative rounded-xl"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.tag && (
          <span
            className={`tag text-white uppercase tracking-wider ${
              product.tag === "NEW" ? "bg-primary" : "bg-danger"
            }`}
          >
            {product.tag}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-colors ${
          isWishlisted 
            ? "bg-danger text-white" 
            : "bg-bg-surface text-text-muted hover:text-danger hover:bg-danger/10"
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative h-32 sm:h-48 mb-3 sm:mb-4 flex items-center justify-center overflow-hidden card-inner bg-bg-base dark:bg-slate-950 group-hover:bg-bg-surface dark:group-hover:bg-slate-800/80 transition-colors rounded-xl shadow-sm">
            {product.discount && (
                <span className="absolute top-4 left-4 text-[10px] font-bold text-white bg-brand-600 rounded-full px-1.5 py-0.5 z-10">
                  {product.discount}% OFF
                </span>
              )}
          <motion.img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="block">
          <h3
            className="text-xs sm:text-sm text-[#0F172A] dark:text-slate-100 mb-1 line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-[#0F172A] dark:group-hover:text-white transition-colors font-normal sm:font-medium hover:text-brand-600"
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            {product.oldPrice && (
              <span className="text-xs text-text-muted dark:text-slate-500 line-through mr-2">
                ৳{product.oldPrice.toFixed(0)}
              </span>
            )}
          
            <div className="text-xs sm:text-sm font-bold text-text-primary dark:text-slate-100">
              ৳
              {product.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-text-muted dark:text-slate-400 uppercase font-bold tracking-widest">
              {product.purchases} Sold
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-2.5 sm:mt-3 flex gap-1.5 sm:gap-2 w-full relative z-20">
          <button 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-dark-blue dark:bg-slate-800 text-white rounded-md flex items-center justify-center hover:opacity-90 transition-colors shrink-0 cursor-pointer shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${product.id}`);
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
    </motion.div>
  );
};

export default ProductCard;
