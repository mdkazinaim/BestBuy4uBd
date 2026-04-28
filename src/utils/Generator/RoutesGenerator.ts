import { JSX } from "react";
import { RouteObject } from "react-router-dom";

export type RouteItem = {
  path?: string;
  index?: boolean;
  element: JSX.Element;
  children?: RouteItem[];
};

type RouteGroup =
  | {
      items?: RouteItem[];
    }
  | RouteItem;

const normalizeRoutes = (routes: RouteItem[]): RouteObject[] => {
  return routes.map((route) => {
    const normalized: RouteObject = {
      element: route.element,
      path: route.path,
      index: route.index ? true : undefined,
    };

    if (route.children && route.children.length > 0) {
      normalized.children = normalizeRoutes(route.children);
    }

    return normalized;
  });
};

export const routesGenerator = (input: RouteGroup[]): RouteObject[] => {
  return input.flatMap((entry) => {
    if ("items" in entry && entry.items) {
      return normalizeRoutes(entry.items);
    }
    return normalizeRoutes([entry as RouteItem]);
  });
};
