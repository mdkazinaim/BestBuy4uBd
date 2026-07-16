import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  User,
  ChevronDown,
  Phone,
  GitCompare,
  Shield,
  Truck,
  RefreshCw,
  ShoppingCart,
  Home,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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

  const promotionalMessages = [
    { icon: <Truck className="w-3 h-3 text-primary-green" />, text: "FREE SHIPPING OVER ৳999" },
    { icon: <RefreshCw className="w-3 h-3 text-primary-green" />, text: "30 DAYS MONEY BACK" },
    { icon: <Shield className="w-3 h-3 text-primary-green" />, text: "100% SECURE PAYMENT" }
  ];
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotionalMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="w-full bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors">
      {/* Top Bar */}
      <div className="bg-light-background dark:bg-slate-950 border-b border-border dark:border-slate-800/80">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Left - Contact */}
            <div className="flex items-center gap-2 text-dark-blue dark:text-slate-200 shrink-0">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Hotline 24/7</span>
              {host.phone ? (
                <span className="font-semibold">{host.phone}</span>
              ) : (
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
              )}
            </div>

            {/* Center - Trust Badges (Desktop) */}
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

            {/* Mobile/Tablet Promotional Ticker */}
            <div className="md:hidden flex-1 flex justify-end items-center h-5 overflow-hidden text-[9px] font-bold uppercase tracking-wider text-light-gray/80 dark:text-slate-400/80 pl-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPromoIndex}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.7 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                >
                  {promotionalMessages[currentPromoIndex].icon}
                  <span>{promotionalMessages[currentPromoIndex].text}</span>
                </motion.div>
              </AnimatePresence>
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
                  {host.logo && (
                    <img src={host.logo} alt={host.title || "Logo"} className="h-10 object-contain" />
                  )}
                  {host.title && (
                    <span>{host.title}</span>
                  )}
                  {!host.logo && !host.title && (
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

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5 text-dark-blue dark:text-slate-200" />
              </button>

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



            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Categories */}
      <div className={`bg-primary-green transition-all duration-300 ${isMobileSearchOpen ? "block" : "hidden lg:block"}`}>
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

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Bottom Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="lg:hidden fixed bottom-[56px] left-0 right-0 bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] z-40 max-h-[70vh] overflow-y-auto"
          >
            {/* Drag Handle Indicator */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3" />
            
            <div className="container mx-auto px-6 pb-6 space-y-4">
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
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 dark:bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-md py-2 px-4 flex items-center justify-between z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 flex-1 transition-colors ${
            location.pathname === "/" ? "text-primary-green" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center gap-1 flex-1 transition-colors ${
            location.pathname === "/shop" ? "text-primary-green" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Shop</span>
        </Link>

        {/* Cart (Center Floating Button) */}
        <div className="flex-1 flex justify-center relative">
          <button
            onClick={() => dispatch(toggleCart())}
            className="absolute -top-7 w-14 h-14 bg-primary-green text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-primary-green/90 transition-all border-4 border-slate-900 dark:border-slate-950 cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-red text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
          <span className="text-[10px] font-medium tracking-wide text-slate-400 mt-7">Cart</span>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => dispatch(toggleWishlist())}
          className={`flex flex-col items-center gap-1 flex-1 transition-colors cursor-pointer ${
            location.pathname === "/wishlist" ? "text-primary-green" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Wishlist</span>
        </button>

        {/* Hamburger Menu */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-1 flex-1 transition-colors cursor-pointer ${
            isMobileMenuOpen ? "text-primary-green" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-wide">Menu</span>
        </button>
      </div>

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
