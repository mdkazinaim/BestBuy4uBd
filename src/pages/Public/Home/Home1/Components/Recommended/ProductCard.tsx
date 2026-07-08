import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { ProductData } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/Slices/wishlistSlice";
import { openWishlist } from "@/store/Slices/UISlice";
import { RootState } from "@/store/store";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: ProductData;
  onOpen: (product: ProductData) => void;
}

const ProductCard = ({ product, onOpen }: ProductCardProps) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some(item => item._id === product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      // Map mock product to WishlistItem structure if needed, or just send it
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
  return (
    <Link to={`/product/${product.id}`} className="h-full block">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-container bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-4 flex flex-col group h-full relative"
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
      <div className="relative h-48 mb-4 flex items-center justify-center overflow-hidden card-inner bg-bg-base dark:bg-slate-950 group-hover:bg-bg-surface dark:group-hover:bg-slate-850/80 transition-colors rounded-xl shadow-sm">
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

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            onClick={() => onOpen(product)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-bg-surface text-text-primary shadow-lg flex items-center justify-center hover:bg-text-primary hover:text-white transition-colors"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => onOpen(product)} // For now, both open detailed modal
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-secondary text-white shadow-lg flex items-center justify-center hover:bg-secondary/90 transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3
          className="text-sm text-[#0F172A] dark:text-slate-100 mb-1 line-clamp-2 min-h-[40px] group-hover:text-[#0F172A] dark:group-hover:text-white transition-colors font-medium"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Rating */}
        {/* <div className="flex items-center gap-1 mb-3">
          <div className="flex text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-current"
                    : "text-text-muted/20"
                }`}
              />
            ))}
          </div>
          <span className="small">({product.reviews})</span>
        </div> */}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            {product.oldPrice && (
              <span className="text-xs text-text-muted dark:text-slate-500 line-through mr-2">
                ৳{product.oldPrice.toFixed(0)}
              </span>
            )}
          
            <div className="text-sm font-bold text-text-primary dark:text-slate-100">
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
      </div>
    </motion.div>
    </Link>
  );
};

export default ProductCard;
