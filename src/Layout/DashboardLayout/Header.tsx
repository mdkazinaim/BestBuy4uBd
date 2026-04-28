import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import UserMenuDropdown from "../PublicLayout/UserMenuDropdown";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Left Side: Search */}
        <div className={`relative flex-1 md:flex-none md:w-80 lg:w-96 ${showMobileSearch ? "block" : "hidden md:block"}`}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 mx-1 md:mx-2"></div>

        {/* User Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 md:gap-3 p-1 rounded-lg hover:bg-gray-50 transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-none">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-gray-500 uppercase mt-1 text-left">
                {user?.role || 'Guest'}
              </p>
            </div>

            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-green/10 rounded-full flex items-center justify-center text-primary-green font-bold border-2 border-primary-green/20 group-hover:border-primary-green/40 transition-all">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              {/* Status Indicator */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Actual Dropdown Card */}
          <UserMenuDropdown user={user || {}} isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header;
