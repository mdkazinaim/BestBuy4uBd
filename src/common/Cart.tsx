import { useSelector, useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../store/Slices/CartSlice";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { TbCurrencyTaka } from "react-icons/tb";
import { Helmet } from "react-helmet";

interface CartItem {
  itemKey: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedVariants?: Array<{ group: string; value: string }>;
}
import { useEffect } from "react";
import { useTracking } from "@/hooks/useTracking";

const Cart: React.FC<{ toggleCart: () => void }> = ({ toggleCart }) => {
  const cartItems = useSelector((state: any) => state.cart.cartItems as CartItem[]) || [];
  const dispatch = useDispatch();
  const { trackRemoveFromCart, trackViewCart } = useTracking();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (cartItems.length > 0) {
      trackViewCart(cartItems.map(item => ({
        id: item.itemKey.split('-')[0] || "unknown", // Best effort ID extraction
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.selectedVariants?.map(v => `${v.group}: ${v.value}`).join(", ")
      })), total);
    }
  }, [cartItems, total]);

  return (
    <>
      <Helmet>
        <title>Shopping Cart | BestBuy4uBD</title>
        <meta
          name="description"
          content="Review your shopping cart, update quantities, and proceed to checkout."
        />
        <meta name="keywords" content="shopping cart, checkout, order" />
      </Helmet>
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 ${isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg z-50 flex flex-col`}
      >
        <div
          className={`p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-800"
            } flex justify-between items-center`}
        >
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="text-white hover:text-gray-300 transition duration-300"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          {!cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p
                className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  } text-lg mb-4`}
              >
                Your cart is empty
              </p>
              <Link to="/products" onClick={toggleCart}>
                <button
                  className={`${isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                    } text-white py-2 px-4 rounded-md transition duration-300`}
                >
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className={`${isDarkMode ? "bg-gray-700" : "bg-white"
                    } rounded-lg shadow-md p-4 border ${isDarkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3
                          className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-800"
                            } line-clamp-2`}
                        >
                          {item.name}
                        </h3>
                        <div
                          className={`flex items-center font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                        >
                          <TbCurrencyTaka className="text-lg" />
                          <span>{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      <div
                        className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                          } flex items-center`}
                      >
                        <TbCurrencyTaka />
                        <span>{item.price.toFixed(2)} each</span>
                      </div>

                      {item.selectedVariants &&
                        item.selectedVariants.length > 0 && (
                          <div className="mt-2">
                            {item.selectedVariants.map((variant, index) => (
                              <span
                                key={index}
                                className={`inline-block mr-2 px-2 py-1 text-xs rounded-full ${isDarkMode
                                  ? "bg-gray-600 text-gray-300"
                                  : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {variant.group}: {variant.value}
                              </span>
                            ))}
                          </div>
                        )}

                      <div className="mt-3 flex items-center">
                        <div
                          className={`flex items-center space-x-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"
                            } rounded-lg px-2 py-1`}
                        >
                          <button
                            onClick={() =>
                              dispatch(
                                decrementQuantity({ itemKey: item.itemKey })
                              )
                            }
                            className={`${isDarkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-800"
                              } focus:outline-none`}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span
                            className={`${isDarkMode ? "text-gray-300" : "text-gray-700"
                              } font-semibold`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                incrementQuantity({ itemKey: item.itemKey })
                              )
                            }
                            className={`${isDarkMode
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-800"
                              } focus:outline-none`}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            // We need product ID, which is missing from CartItem interface in Cart.tsx (only has itemKey)
                            // Assuming itemKey format is id-variantKey, we can extract it or pass itemKey as ID if needed.
                            // Actually referencing CartSlice, CartItem has `id`. But local interface `CartItem` in this file is limited.
                            // Let's rely on itemKey or try to cast if the real object has id.
                            // For now, let's use itemKey or best effort.
                            const itemId = item.itemKey.split('-')[0] || "unknown";

                            trackRemoveFromCart({
                              id: itemId,
                              name: item.name,
                              price: item.price,
                              quantity: item.quantity,
                              variant: item.selectedVariants?.map(v => `${v.group}: ${v.value}`).join(", ")
                            });
                            dispatch(removeFromCart({ itemKey: item.itemKey }))
                          }}
                          className="ml-auto text-red-500 hover:text-red-600 focus:outline-none"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={`p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"
            } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"
                }`}
            >
              Total:
            </span>
            <div className="flex items-center text-xl font-bold text-blue-500">
              <TbCurrencyTaka className="text-2xl" />
              <span>{total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" onClick={toggleCart}>
            <button
              className={`w-full ${isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
                } text-white py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg font-semibold`}
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
