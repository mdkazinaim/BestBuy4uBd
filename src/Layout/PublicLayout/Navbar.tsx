import { useState } from "react";
import {
  Search,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Phone,
  GitCompare,
  Shield,
  Truck,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavItems from "./NavItems";
import CartSidebar from "./CartSidebar";
import WishlistSidebar from "./WishlistSidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  toggleCart,
  closeCart,
  toggleWishlist,
  closeWishlist,
} from "@/store/Slices/UISlice";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";
import UserMenuDropdown from "./UserMenuDropdown";
import { useGetHost } from "@/utils/useGetHost";
import { useGetAllCategoriesQuery } from "@/store/Api/CategoriesApi";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Navbar = () => {
  const host = useGetHost();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isCartOpen, isWishlistOpen } = useSelector(
    (state: RootState) => state.ui,
  );
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: categoriesData } = useGetAllCategoriesQuery(undefined);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const wishlistCount = wishlistItems.length;

  return (
    <nav className="w-full bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors">
      {/* Top Bar */}
      <div className="bg-light-background dark:bg-slate-950 border-b border-border dark:border-slate-800/80">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Left - Contact */}
            <div className="flex items-center gap-2 text-dark-blue dark:text-slate-200">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Hotline 24/7</span>
              {host.phone ? (
                <span className="font-semibold">{host.phone}</span>
              ) : (
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
              )}
            </div>

            {/* Center - Trust Badges */}
            <div className="hidden md:flex items-center gap-6 text-light-gray/80 dark:text-slate-400/80">
              <div className="flex items-center gap-1.5 opacity-70">
                <Truck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">FREE SHIPPING OVER ৳999</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-70">
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">30 DAYS MONEY BACK</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-70">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">100% SECURE PAYMENT</span>
              </div>
            </div>

            {/* Right - Order Track */}
            <div className="flex items-center gap-4 text-light-gray dark:text-slate-400 text-xs">
              <Link
                to="/order-track"
                className="hover:text-primary-blue dark:hover:text-blue-400 transition-colors hidden sm:inline font-medium"
              >
                Order Track
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-xl font-bold text-dark-blue dark:text-white hover:text-primary-green dark:hover:text-primary-green transition-colors"
                >
                  {host.logo ? (
                    <img src={host.logo} alt={host.title || "Logo"} className="h-10 object-contain" />
                  ) : host.title ? (
                    <span>{host.title}</span>
                  ) : (
                    <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                  )}
                </Link>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <NavItems className="hidden lg:block text-xs uppercase tracking-widest font-bold text-slate-600" />

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Compare Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background dark:hover:bg-slate-800 transition-colors">
                <GitCompare className="w-5 h-5 text-dark-blue dark:text-slate-200" />
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Wishlist Button */}
              <button
                onClick={() => dispatch(toggleWishlist())}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background dark:hover:bg-slate-800 transition-colors relative group"
              >
                <Heart className="w-5 h-5 text-dark-blue dark:text-slate-200 group-hover:text-primary-red transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-red text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              {user?.email ? (
                <div className="relative group z-50">
                  <button className="hidden md:flex items-center gap-2 hover:text-primary-blue dark:hover:text-blue-400 transition-colors">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-full flex items-center justify-center border border-primary-green/20">
                      <User className="w-5 h-5 text-primary-green" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-xs text-light-gray dark:text-slate-400">
                        {user.role === "admin" ? "ADMIN" : "HELLO,"}
                      </span>
                      <span className="text-sm font-semibold text-dark-blue dark:text-slate-200 max-w-[100px] truncate">
                        {user.email.split("@")[0]}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-light-gray dark:text-slate-400 group-hover:text-primary-blue dark:group-hover:text-blue-400 transition-colors" />
                  </button>

                  {/* Dropdown Menu */}
                  <UserMenuDropdown user={user} />
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 hover:text-primary-blue dark:hover:text-blue-400 transition-colors"
                >
                  <div className="w-10 h-10 bg-light-background dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-dark-blue dark:text-slate-200" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs text-light-gray dark:text-slate-400 uppercase tracking-widest font-bold">
                      WELCOME
                    </span>
                    <span className="text-sm font-bold text-dark-blue dark:text-slate-200">
                      LOG IN / REGISTER
                    </span>
                  </div>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="flex items-center gap-2 hover:text-primary-blue dark:hover:text-blue-400 transition-colors group cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-light-background dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-primary-green/10 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-dark-blue dark:text-slate-200 group-hover:text-primary-green transition-colors" />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-green text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-light-gray dark:text-slate-400 font-black uppercase tracking-widest">
                    CART
                  </span>
                  <span className="text-sm font-black text-dark-blue dark:text-slate-200">
                    ৳{cartSubtotal.toLocaleString()}
                  </span>
                </div>
              </button>


              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Categories */}
      <div className="bg-primary-green">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-6">
            {/* Search Section - Reverted to previous design */}
            <div className="flex items-center w-full lg:w-auto lg:flex-1 lg:max-w-md border border-white rounded-full bg-white">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full px-4 py-3 pr-12 outline-none text-sm text-dark-blue placeholder:text-light-gray rounded-full"
                />
                <button className="absolute right-0 top-0 h-full px-4 hover:opacity-80 transition-opacity">
                  <Search className="w-5 h-5 text-dark-blue" />
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="hidden xl:flex flex-col items-end leading-none text-white">
              <div className="hidden lg:flex items-center gap-6">
                {categoriesData?.data?.slice(0, 6).map((category: any) => (
                  <Link
                    key={category._id}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    className="text-white text-sm font-semibold uppercase hover:text-dark-blue transition-colors whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <NavItems
                isMobile={true}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="pt-3 border-t border-border dark:border-slate-800 space-y-3">
                <button className="w-full text-left px-5 py-2 text-dark-blue dark:text-slate-200 hover:text-primary-blue dark:hover:text-blue-400 transition-colors font-semibold cursor-pointer">
                  Compare
                </button>
                <button
                  onClick={() => {
                    dispatch(toggleWishlist());
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-2 text-dark-blue dark:text-slate-200 hover:text-primary-blue dark:hover:text-blue-400 transition-colors font-semibold flex items-center justify-between cursor-pointer"
                >
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="bg-primary-red text-white text-[10px] px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                {user?.email ? (
                  <>
                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left px-5 py-2 text-dark-blue dark:text-slate-200 hover:text-primary-blue dark:hover:text-blue-400 transition-colors font-semibold no-underline"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logOut());
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-5 py-2 text-danger hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-semibold cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-5 py-2 text-dark-blue dark:text-slate-200 hover:text-primary-blue dark:hover:text-blue-400 transition-colors font-semibold no-underline"
                  >
                    Log In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
      {/* Wishlist Sidebar */}
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={() => dispatch(closeWishlist())}
      />
    </nav>
  );
};

export default Navbar;
