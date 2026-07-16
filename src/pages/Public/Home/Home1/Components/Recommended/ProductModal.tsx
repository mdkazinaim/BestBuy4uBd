import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star } from "lucide-react";
import { ProductData } from "./types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";

interface ProductModalProps {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  if (!product) return null;

  const handleOrder = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    );
    onClose();
    // Redirect to checkout
    window.location.href = "/checkout";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 md:p-0"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl mx-auto md:my-8 overflow-hidden border border-gray-100 dark:border-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-slate-400" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-50 dark:bg-slate-950 p-8 flex items-center justify-center relative">
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    className="max-h-[300px] md:max-h-[400px] object-contain drop-shadow-xl"
                    layoutId={`product-image-${product.id}`}
                  />
                  {product.tag && (
                    <span className="absolute top-6 left-6 bg-primary-green text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {product.tag}
                    </span>
                  )}
                </div>

                 {/* Details Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                  <div className="mb-auto">
                    {product.brand && (
                      <h4 className="text-light-gray dark:text-slate-400 font-semibold text-sm uppercase tracking-wider mb-2">
                        {product.brand}
                      </h4>
                    )}
                    <h2 className="text-xl font-bold text-dark-blue dark:text-slate-100 mb-2 leading-tight line-clamp-2">
                      {product.title}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-current"
                                : "text-gray-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-slate-400">
                        Based on {product.reviews} reviews
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="text-3xl font-bold text-primary-green">
                        ৳{product.price.toFixed(2)}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xl text-gray-400 dark:text-slate-500 line-through">
                          ৳{product.oldPrice.toFixed(2)}
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-primary-red/10 text-primary-red text-sm font-bold px-2 py-1 rounded">
                          -{product.discount}% OFF
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-slate-300 mb-8 leading-relaxed line-clamp-2">
                      {product.description
                        ? product.description.replace(/<[^>]*>/g, "")
                        : "Experience premium quality and exceptional performance with this top-rated product. Designed for durability and comfort."}
                    </p>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg px-4 py-2 w-max">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 dark:text-slate-400 hover:text-dark-blue dark:hover:text-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-dark-blue dark:text-slate-100 select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 dark:text-slate-400 hover:text-dark-blue dark:hover:text-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={handleOrder}
                        className="flex-1 bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                      >
                        অর্ডার করুন
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-6">
                    <button className="flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-primary-red transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Add to Wishlist
                      </span>
                    </button>
                    <span className="text-sm text-gray-400 dark:text-slate-500">
                      {product.purchases.toLocaleString()} people bought this
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
