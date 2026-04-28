import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { publicRoutes } from "@/routes/PublicRoutes";
import { menuGenerator, MenuItem } from "@/utils/Generator/MenuGenerator";
import { ChevronDown } from "lucide-react";

const NavItems = ({
  className,
  classNameNC,
  classNameC,
  isMobile = false,
  onItemClick,
  isFooter,
}: {
  className?: string;
  classNameNC?: string;
  classNameC?: string;
  isMobile?: boolean;
  isFooter?: boolean;
  onItemClick?: () => void;
}) => {
  const location = useLocation();
  const navbarItems = menuGenerator(publicRoutes);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  // 🔹 Helper: check if a path is active or a parent of the active path
  const isPathActive = (path?: string, children?: MenuItem[]) => {
    if (!path) return false;

    // Exact match or nested match
    if (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    ) {
      return true;
    }

    // Any child active
    if (children?.length) {
      return children.some((child) =>
        child.path
          ? location.pathname === child.path ||
            location.pathname.startsWith(child.path + "/")
          : false
      );
    }

    return false;
  };

  return (
    <nav className={className}>
      <ul
        className={`${isFooter ? "flex-col" : "flex"} ${isMobile ? "flex-col w-full" : "gap-4"}`}
      >
        {navbarItems.map((item) => {
          const parentActive = isPathActive(item.path, item.children);
          const hasChildren = item.children && item.children.length > 0;
          const isDropdownOpen = openDropdown === item.label;

          return (
            <li
              key={item.path ?? item.label}
              className={`relative group ${isMobile ? "w-full" : ""}`}
            >
              {/* Parent item */}
              <div className="flex items-center justify-between">
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={onItemClick}
                    className={`px-5 py-2  font-semibold inline-block no-underline flex-1 ${
                      parentActive ? "border-b-2" : ""
                    } ${classNameNC}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="px-5 py-2  font-semibold inline-block cursor-default flex-1">
                    {item.label}
                  </span>
                )}

                {hasChildren && isMobile && (
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {hasChildren && !isMobile && (
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                )}
              </div>

              {/* Dropdown */}
              {hasChildren && (
                <ul
                  className={`
                  ${
                    isMobile
                      ? `w-full bg-slate-50 overflow-hidden transition-all duration-300 ${
                          isDropdownOpen ? "max-h-[500px] py-2" : "max-h-0"
                        }`
                      : "absolute left-0 top-full hidden min-w-[200px] rounded-lg bg-white shadow-lg group-hover:block border border-border z-20"
                  }
                `}
                >
                  {item.children!.map((child) => {
                    const childActive =
                      child.path &&
                      (location.pathname === child.path ||
                        location.pathname.startsWith(child.path + "/"));

                    return (
                      <li key={child.path}>
                        <Link
                          to={child.path || "#"}
                          onClick={onItemClick}
                          className={`block px-5 py-2 text-slate-600 hover:bg-slate-100 no-underline ${
                            isMobile ? "text-left pl-10" : "text-center"
                          } ${
                            childActive
                              ? "bg-slate-200 border-b-2 font-semibold"
                              : ""
                          } ${classNameC}`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavItems;
