import Dashboard from "@/pages/User/Dashboard/Dashboard";
import Order from "@/pages/User/Order/Order";
import Settings from "@/pages/User/Settings/Settings";
import { Settings2, TruckIcon, User } from "lucide-react";
export const userRoutes = [
  {
    icon: <User />,
    label: "Dashboard",
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    icon: <TruckIcon />,
    label: "Track Order",
    path: "track-order",
    element: <Order />,
  },
  {
    icon: <Settings2 />,
    label: "Settings",
    path: "settings",
    element: <Settings />,
  },
];
