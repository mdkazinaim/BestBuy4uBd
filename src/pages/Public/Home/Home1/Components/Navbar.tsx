import { useState } from "react";
import { Phone, Globe, GitCompare, Shield, Truck, RefreshCw, ChevronDown, Menu, X, Search, Heart, ShoppingCart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useGetHost } from "@/utils/useGetHost";

const Navbar = () => {
  const host = useGetHost();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="w-full bg-bg-surface shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-bg-base border-b border-border-main">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Left - Contact Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-text-primary">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline font-medium uppercase tracking-widest text-[10px]">
                  Hotline 24/7
                </span>
                <span className="font-semibold text-xs tracking-widest">(025) 3886 2516</span>
              </div>
            </div>

            {/* Right - Links & Settings */}
            <div className="flex items-center gap-4 text-text-muted">
              <a
                href="#"
                className="hover:text-primary transition-colors hidden md:inline font-medium uppercase tracking-widest text-[10px]"
              >
                Sell on BestBuy
              </a>
              <Link
                to="/order-track"
                className="hover:text-primary transition-colors hidden md:inline font-medium uppercase tracking-widest text-[10px]"
              >
                Order Track
              </Link>

              {/* Currency Dropdown */}
              <button className="flex items-center gap-1 hover:text-primary transition-colors font-medium uppercase tracking-widest text-[10px]">
                <span>BDT</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {/* Language Dropdown */}
              <button className="flex items-center gap-1 hover:text-primary transition-colors font-medium uppercase tracking-widest text-[10px]">
                <Globe className="w-3.5 h-3.5" />
                <span>Eng</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-bg-surface border-b border-border-main">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-component flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-semibold text-text-primary uppercase tracking-tighter">
                  {host.title || "BESTBUY4UBD"}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <NavItem label="HOMES" hasDropdown />
              <NavItem label="PAGES" hasDropdown />
              <NavItem label="PRODUCTS" hasDropdown />
              <NavItem label="CONTACT" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Compare Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-component hover:bg-bg-base transition-colors">
                <GitCompare className="w-5 h-5 text-text-primary" />
              </button>

              {/* Wishlist Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-component hover:bg-bg-base transition-colors">
                <Heart className="w-5 h-5 text-text-primary" />
              </button>

              {/* User Account */}
              <button className="hidden md:flex items-center gap-2 hover:text-primary transition-colors group">
                <div className="w-10 h-10 bg-bg-base rounded-component flex items-center justify-center transition-colors group-hover:bg-bg-surface border border-transparent group-hover:border-border-main">
                  <User className="w-5 h-5 text-text-primary" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest">WELCOME</span>
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-tighter">
                    LOG IN / REGISTER
                  </span>
                </div>
              </button>

              {/* Cart */}
              <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                <div className="relative">
                  <div className="w-10 h-10 bg-bg-base rounded-component flex items-center justify-center transition-colors group-hover:bg-bg-surface border border-transparent group-hover:border-border-main">
                    <ShoppingCart className="w-5 h-5 text-text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[9px] font-semibold text-text-muted uppercase tracking-widest">CART</span>
                  <span className="text-xs font-semibold text-text-primary uppercase tracking-tighter">
                    ৳1,689.00
                  </span>
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-text-primary"
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

      {/* Search Bar & Trust Badges */}
      <div className="bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-4">
            {/* Search Section */}
            <div className="flex items-center w-full lg:w-auto lg:flex-1 lg:max-w-md border border-white/20 rounded-component bg-white/10 backdrop-blur-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full px-6 py-3 pr-12 outline-none text-xs font-semibold text-white placeholder:text-white/60 bg-transparent uppercase tracking-widest"
                />
                <button className="absolute right-0 top-0 h-full px-4 hover:opacity-80 transition-opacity">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="hidden lg:flex items-center gap-8 text-white">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5" />
                <span className="text-[10px] font-semibold whitespace-nowrap uppercase tracking-widest">
                  FREE SHIPPING OVER ৳199
                </span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5" />
                <span className="text-[10px] font-semibold whitespace-nowrap uppercase tracking-widest">
                  30 DAYS MONEY BACK
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span className="text-[10px] font-semibold whitespace-nowrap uppercase tracking-widest">
                  100% SECURE PAYMENT
                </span>
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
            className="lg:hidden bg-bg-surface border-t border-border-main overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <MobileNavItem label="HOMES" />
              <MobileNavItem label="PAGES" />
              <MobileNavItem label="PRODUCTS" />
              <MobileNavItem label="CONTACT" />
              <div className="pt-3 border-t border-border-main space-y-3">
                <button className="w-full text-left py-2 text-text-primary hover:text-secondary transition-colors font-semibold text-xs uppercase tracking-widest">
                  Compare
                </button>
                <button className="w-full text-left py-2 text-text-primary hover:text-secondary transition-colors font-semibold text-xs uppercase tracking-widest">
                  Wishlist
                </button>
                <button className="w-full text-left py-2 text-text-primary hover:text-secondary transition-colors font-semibold text-xs uppercase tracking-widest">
                  Log In / Register
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Nav Item Component
const NavItem = ({
  label,
  hasDropdown = false,
}: {
  label: string;
  hasDropdown?: boolean;
}) => {
  return (
    <button className="flex items-center gap-1 text-xs font-semibold text-text-primary hover:text-secondary transition-colors uppercase tracking-widest">
      {label}
      {hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
    </button>
  );
};

// Mobile Nav Item Component
const MobileNavItem = ({ label }: { label: string }) => {
  return (
    <button className="w-full text-left py-2 text-text-primary hover:text-secondary transition-colors font-semibold text-xs uppercase tracking-widest">
      {label}
    </button>
  );
};

export default Navbar;
