import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { adminRoutes } from "@/routes/AdminRoutes";
import { menuGenerator, MenuItem } from "@/utils/Generator/MenuGenerator";
import { Location } from "react-router-dom";
import { userRoutes } from "@/routes/UserRoutes";
import { useGetHost } from "@/utils/useGetHost";
import { X } from "lucide-react";

// Sub-component to handle recursive levels and isolated hover states
const NavItem = ({
  item,
  level,
  location,
  onClose,
}: {
  item: MenuItem;
  level: number;
  location: Location;
  onClose?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = !!item.children?.length;

  // Active route logic
  const isRouteActive = (item: MenuItem, currentPath: string): boolean => {
    if (item.path && currentPath === item.path) return true;
    if (item.children)
      return item.children.some((child) => isRouteActive(child, currentPath));
    return false;
  };

  const active = isRouteActive(item, location.pathname);

  const itemClasses = `flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 no-underline!
    ${
      active
        ? "bg-gray-500 text-white font-medium"
        : "text-white hover:bg-white hover:text-gray-800"
    }`;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parent / Leaf Link */}
      <NavLink
        to={item.path || "#"}
        onClick={() => !hasChildren && onClose && onClose()}
        className={`${itemClasses} cursor-pointer whitespace-nowrap`}
      >
        {item.icon}
        <span className="flex-1 text-sm font-medium uppercase no-underline!">
          {item.label}
        </span>
        {hasChildren && (
          <span
            className={`text-[10px] transition-transform duration-200 ${
              isHovered ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
        )}
      </NavLink>

      {/* Sub-menu: Renders only if hovered AND has children */}
      {hasChildren && isHovered && (
        <div
          className="absolute left-full top-0 z-[100] pt-0 pl-2 animate-in fade-in slide-in-from-left-1 duration-150"
          style={{ marginLeft: "-2px" }} // Slight overlap to prevent hover-gap flicker
        >
          {/* Invisible bridge */}
          <div className="absolute -left-2 top-0 h-full w-2" />

          <div className="w-52 p-1 bg-gray-800 border border-gray-600 shadow-2xl rounded-md">
            <div className="space-y-1">
              {item.children!.map((child) => (
                <NavItem
                  key={child.label + child.path}
                  item={child}
                  level={level + 1}
                  location={location}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const host = useGetHost();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const menu = isAdmin
    ? menuGenerator(adminRoutes, "/admin")
    : menuGenerator(userRoutes, "/user");

  const groupedMenu = menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const group = item.group || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <aside className="w-64 h-screen bg-gray-700 text-white sticky top-0 z-40 flex flex-col print:hidden">
      <div className="p-4 h-16 text-xl font-bold border-b border-gray-600 flex items-center justify-between">
        <Link to="/" className="no-underline flex items-center gap-2" onClick={onClose}>
          {host.logo && (
            <img src={host.logo} alt={host.title || "Logo"} className="h-8 max-w-[180px] object-contain" />
          )}
          {host.title && (
            <p className="text-xl font-bold text-white mb-0 truncate">
              {host.title}
            </p>
          )}
          {!host.logo && !host.title && (
            <div className="w-32 h-6 bg-gray-600 animate-pulse rounded"></div>
          )}
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-gray-600 rounded-md transition-colors"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <nav className="p-2 space-y-4 flex-1 overflow-y-visible overflow-x-visible">
        {Object.entries(groupedMenu).map(([group, items]) => (
          <div key={group} className="mt-2">
            <p className="px-3 mb-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
              {group}
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <NavItem
                  key={item.label + item.path}
                  item={item}
                  level={0}
                  location={location}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
