import { useMemo, isValidElement, cloneElement, ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { flattenRoutes } from "@/utils/Generator/BreadcrumbsGenerator";
import { RouteGroup } from "@/utils/Generator/MenuGenerator";

interface BreadcrumbProps {
  config: RouteGroup[];
  basePath: string;
}

const Breadcrumbs = ({ config, basePath }: BreadcrumbProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Automatically detects and flattens the provided config
  const routeMap = useMemo(
    () => flattenRoutes(config, basePath),
    [config, basePath]
  );

  return (
    <nav className="flex items-center flex-wrap gap-y-2 space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6 px-1">
      <Link to={basePath} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        <Home className="size-4" />
      </Link>

      {pathnames.map((_, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        if (to === basePath) return null;

        const last = index === pathnames.length - 1;
        const routeData = routeMap[to];
        const rawSegment = pathnames[index];

        const displayName =
          routeData?.name ||
          rawSegment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

        const renderIcon = () => {
          if (!routeData?.icon || !isValidElement(routeData.icon)) return null;
          return cloneElement(
            routeData.icon as ReactElement,
            {
              className: "size-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500",
            } as React.HTMLAttributes<HTMLElement>
          );
        };

        return (
          <div key={to} className="flex items-center space-x-2">
            <ChevronRight className="size-4 text-slate-300 dark:text-slate-600 shrink-0" />
            <div
              className={`flex items-center gap-1.5 ${
                last ? "text-slate-900 dark:text-slate-100 font-semibold" : ""
              }`}
            >
              {renderIcon()}
              {last ? (
                <span>{displayName}</span>
              ) : (
                <Link
                  to={to}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors no-underline"
                >
                  {displayName}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
