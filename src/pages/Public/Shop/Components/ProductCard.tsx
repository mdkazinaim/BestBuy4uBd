import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/types/Product/Product";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";
import { openWishlist } from "@/store/Slices/UISlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/Slices/wishlistSlice";
import { RootState } from "@/store/store";
import { useTracking } from "@/hooks/useTracking";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    trackAddToCart,
    trackSelectItem,
    trackWishlistRemove,
    trackAddToWishlist,
  } = useTracking();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const { basicInfo, price, images, stockStatus } = product;

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        id: product._id,
        name: basicInfo.title,
        price: price.discounted || price.regular,
        image: images[0]?.url,
        quantity: 1,
        selectedVariants: [],
      }),
    );

    trackAddToCart({
      id: product._id,
      name: basicInfo.title,
      price: price.discounted || price.regular,
      category: basicInfo.category,
      quantity: 1,
    });

    navigate('/checkout');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      trackWishlistRemove({
        id: product._id,
        name: basicInfo.title,
        price: price.discounted || price.regular,
        category: basicInfo.category,
      });
      dispatch(removeFromWishlist(product._id));
    } else {
      trackAddToWishlist({
        id: product._id,
        name: basicInfo.title,
        price: price.discounted || price.regular,
        category: basicInfo.category,
      });
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
    }
  };

  const discountPercentage = price.discounted
    ? Math.round(((price.regular - price.discounted) / price.regular) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative card-container p-2 h-full flex flex-col bg-bg-surface shadow-xs hover:shadow-md hover:border-secondary/30 transition-all duration-300 rounded-xl border border-gray-200 dark:border-slate-800/60"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5">
        {discountPercentage > 0 && (
          <span className="tag bg-danger text-white shadow-lg text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded">
            -{discountPercentage}%
          </span>
        )}
        {product.additionalInfo?.isFeatured && (
          <span className="tag bg-primary text-white shadow-lg text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded">
            Featured
          </span>
        )}
        {stockStatus === "Out of Stock" && (
          <span className="tag bg-text-muted text-white shadow-lg text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2 rounded">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isWishlisted
            ? "bg-danger text-white"
            : "bg-bg-surface/80 text-text-muted hover:text-danger hover:bg-bg-surface"
        }`}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-current" : ""}`} />
      </button>

      {/* Image Container */}
      <Link
        to={`/product/${product._id}`}
        className="block"
        onClick={() =>
          trackSelectItem({
            id: product._id,
            name: basicInfo.title,
            price: price.discounted || price.regular,
            category: basicInfo.category,
            list_name: "Product List",
            list_id: "product_list",
          })
        }
      >
        <div className="relative h-36 sm:h-48 md:h-56 flex items-center justify-center overflow-hidden card-inner group-hover:bg-bg-surface transition-colors duration-500 border border-slate-100 dark:border-slate-800/60 rounded-b-none rounded-t-xl">
          <motion.img
            src={images[0]?.url || "https://via.placeholder.com/300"}
            alt={basicInfo.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-t-xl"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col p-2 sm:p-3 rounded-xl">
        <div className="text-[9px] sm:text-[10px] font-semibold text-secondary uppercase tracking-widest mb-1">
          {basicInfo.category}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="block hover:text-secondary mb-1.5"
          onClick={() =>
            trackSelectItem({
              id: product._id,
              name: basicInfo.title,
              price: price.discounted || price.regular,
              category: basicInfo.category,
              list_name: "Product List",
              list_id: "product_list",
            })
          }
        >
          <h3
            className="text-slate-900 dark:text-slate-100 line-clamp-2 text-xs sm:text-sm leading-tight group-hover:text-secondary transition-colors duration-300 min-h-[32px] sm:min-h-[40px]"
            title={basicInfo.title}
          >
            {basicInfo.title}
          </h3>
        </Link>

        <div className="mt-auto pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {price.discounted ? (
              <>
                <span className="text-[10px] sm:text-xs text-text-muted dark:text-slate-400 line-through font-medium">
                  ৳{price.regular.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base md:text-lg font-semibold text-secondary">
                  ৳{price.discounted.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base md:text-lg font-semibold text-secondary">
                ৳{price.regular.toLocaleString()}
              </span>
            )}
          </div>

          <div className="text-left sm:text-right">
            <div
              className={`tag p-1 sm:p-1.5 text-[9px] sm:text-xs rounded-sm ${
                stockStatus === "In Stock"
                  ? "bg-secondary/10 text-secondary"
                  : stockStatus === "Pre-order"
                    ? "bg-accent/10 text-accent"
                    : "bg-danger/10 text-danger"
              }`}
            >
              {stockStatus}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-1.5 w-full relative z-20">
          <button 
            className="w-8 h-8 sm:w-10 sm:h-10 bg-dark-blue dark:bg-slate-800 text-white rounded-md flex items-center justify-center hover:opacity-90 transition-colors shrink-0 cursor-pointer shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${product._id}`);
            }}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            className="flex-1 bg-secondary text-white rounded-md font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-sm py-1.5 sm:py-2"
            disabled={stockStatus === "Out of Stock"}
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

