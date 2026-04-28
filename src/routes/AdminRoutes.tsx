import Settings from "@/pages/Admin/Settings/Settings";
import Dashboard from "@/pages/Admin/Dashboard/Dashboard";
import Category from "@/pages/Admin/Category/Category";
import AddProduct from "@/pages/Admin/AddProduct/AddProduct";
import Product from "@/pages/Admin/Product/Product";
import CMS from "@/pages/Admin/CMS/CMS";
import Services from "@/pages/Admin/Services/Services";
import SteadfastManager from "@/pages/Admin/Steadfast/SteadfastManager";
import AllOrders from "@/pages/Admin/Order/AllOrders";
import OrderDetails from "@/pages/Admin/Order/OrderDetails";
import InvoiceContainer from "@/pages/Admin/Order/Invoice/InvoiceContainer";
import {
  LayoutDashboard,
  SettingsIcon,
  PackageSearch,
  Package2,
  LayoutTemplate,
  ShoppingCart,
  Briefcase,
  Truck,
  LayoutGrid
} from "lucide-react";

export const adminRoutes = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: <LayoutDashboard />,
        path: "dashboard",
        element: <Dashboard />,
      },
    ]
  },
  {
    group: "Order Management",
    items: [
      {
        label: "All Orders",
        icon: <ShoppingCart />,
        path: "orders",
        element: <AllOrders />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
      },
      {
        path: "orders/invoice/:id",
        element: <InvoiceContainer />,
      },
    ]
  },
  {
    group: "Product Management",
    items: [
      {
        label: "Products",
        icon: <Package2 />,
        path: "products",
        element: <Product />,
      },
      {
        label: "Add Product",
        icon: <PackageSearch />,
        path: "add-product",
        element: <AddProduct />,
      },
      {
        label: "Categories",
        icon: <LayoutGrid />,
        path: "categories",
        element: <Category />,
      },
      {
        path: "update-product/:id",
        element: <AddProduct />,
      },
    ]
  },
  {
    group: "Configuration",
    items: [
      {
        label: "CMS",
        icon: <LayoutTemplate />,
        path: "cms",
        element: <CMS />,
      },
      {
        label: "Services",
        icon: <Briefcase />,
        path: "services",
        element: <Services />,
      },
      {
        label: "Steadfast Courier",
        icon: <Truck />,
        path: "courier",
        element: <SteadfastManager />,
      },
      {
        label: "Settings",
        icon: <SettingsIcon />,
        path: "settings",
        element: <Settings />,
      },
    ]
  }
];
