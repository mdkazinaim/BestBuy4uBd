import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/Product/Product";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart, openWishlist } from "@/store/Slices/UISlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/Slices/wishlistSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTracking } from "@/hooks/useTracking";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const {
    trackAddToCart,
    trackSelectItem,
    trackWishlistRemove,
    trackAddToWishlist,
  } = useTracking();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const { basicInfo, price, images, stockStatus } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
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

    dispatch(openCart());
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
    <Link
      to={`/product/${product._id}`}
      className="h-full block"
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
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative card-container p-2 h-full flex flex-col hover:border-primary/20 rounded-xl"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="tag bg-danger text-white shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product.additionalInfo?.isFeatured && (
            <span className="tag bg-primary text-white shadow-lg">
              Featured
            </span>
          )}
          {stockStatus === "Out of Stock" && (
            <span className="tag bg-text-muted text-white shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            isWishlisted
              ? "bg-danger text-white"
              : "bg-bg-surface/80 text-text-muted hover:text-danger hover:bg-bg-surface"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Image Container */}
        <div className="relative h-56 flex items-center justify-center overflow-hidden card-inner group-hover:bg-bg-surface transition-colors duration-500 border border-gray-100 rounded-b-none -mb-1 hover:mb-0 rounded-t-xl ">
          <motion.img
            src={images[0]?.url || "https://via.placeholder.com/300"}
            alt={basicInfo.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-t-xl"
          />

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 rounded-full bg-bg-surface text-text-primary shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              disabled={stockStatus === "Out of Stock"}
              className={`w-11 h-11 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                stockStatus === "Out of Stock"
                  ? "bg-text-muted/20 cursor-not-allowed text-text-muted"
                  : "bg-secondary text-white hover:bg-secondary/90"
              }`}
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 shadow-sm rounded-xl">
          <div className="text-[10px] font-semibold text-secondary uppercase tracking-widest mb-1">
            {basicInfo.category}
          </div>

          <h3
            className="text-[#0F172A] mb-2 line-clamp-2 text-sm leading-tight group-hover:text-secondary transition-colors duration-300 "
            title={basicInfo.title}
          >
            {basicInfo.title}
          </h3>

          {/* Rating */}
          {/* <div className="flex items-center gap-2 mb-4">
            <div className="flex text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating?.average || 0)
                      ? "fill-current"
                      : "text-text-muted/20"
                  }`}
                />
              ))}
            </div>
            <span className="small font-medium">
              ({rating?.count || 0} reviews)
            </span>
          </div> */}

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {price.discounted ? (
                <>
                  <span className="text-xs text-text-muted line-through font-medium">
                    ৳{price.regular.toLocaleString()}
                  </span>
                  <span className="text-xl font-semibold text-danger">
                    ৳{price.discounted.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-semibold text-text-primary">
                  ৳{price.regular.toLocaleString()}
                </span>
              )}
            </div>

            <div className="text-right">
              <div
                className={`tag p-1.5 text-xs rounded-sm ${
                  stockStatus === "In Stock"
                    ? "bg-secondary/10 text-secondary"
                    : stockStatus === "Pre-order"
                      ? "bg-accent/10 text-accent"
                      : "bg-danger/10 text-danger"
                }`}
              >
                {stockStatus}
              </div>
              {/* <span className="text-[10px] text-text-muted font-medium mt-1 block">
                {product.sold || 0} Sold
              </span> */}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
