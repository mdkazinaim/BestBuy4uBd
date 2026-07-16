import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";
import { useGetDashboardStatsQuery } from "@/store/Api/DashboardApi";
import { useGetUserDashboardStatsQuery } from "@/store/Api/UserDashboardApi";
import {
  LayoutDashboard,
  LogOut,
  Clock,
  ShoppingCart,
  DollarSign,
  Package,
  Loader2
} from "lucide-react";

interface UserMenuDropdownProps {
  user: {
    email?: string;
    role?: string;
  };
  onClose?: () => void;
  isOpen?: boolean;
}

const UserMenuDropdown = ({ user, onClose, isOpen }: UserMenuDropdownProps) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    if (onClose) onClose();
  };

  const visibilityClasses = isOpen === undefined
    ? "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
    : isOpen ? "opacity-100 visible" : "opacity-0 invisible";

  return (
    <div className={`absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border-main dark:border-slate-800 py-2 ${visibilityClasses} transition-all duration-200 transform origin-top-right z-50 overflow-hidden`}>
      {/* User Header */}
      <div className="px-4 py-3 border-b border-border-main dark:border-slate-800 bg-bg-base/30 dark:bg-slate-800/50">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Signed in as
        </p>
        <p className="text-sm font-bold text-text-primary truncate">
          {user.email}
        </p>
        <div className="mt-1 inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary">
          {user.role}
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-2">
        {user.role === "admin" ? (
          <AdminStats />
        ) : (
          <UserStats />
        )}
      </div>

      <div className="h-px bg-border-main dark:bg-slate-800 my-1" />

      {/* Menu Links */}
      <div className="px-2">
        <Link
          to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-bg-base dark:hover:bg-slate-800 transition-colors group/item"
        >
          <div className="p-1.5 rounded-md bg-bg-base dark:bg-slate-800 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 transition-colors text-text-secondary">
             <LayoutDashboard className="w-4 h-4" />
          </div>
          Go to Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-colors group/item"
        >
          <div className="p-1.5 rounded-md bg-danger/10 text-danger dark:bg-danger/20">
            <LogOut className="w-4 h-4" />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Sub-components for Stats to keep logic clean

const AdminStats = () => {
  const { data, isLoading } = useGetDashboardStatsQuery(undefined, { pollingInterval: 60000 });
  const stats = data?.data?.overview;

  if (isLoading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-5 h-5 text-primary" /></div>;
  if (!stats) return <div className="p-4 text-xs text-center text-text-muted">No stats available</div>;

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <div className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded-lg border border-orange-100/50 dark:border-orange-900/20">
        <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 mb-1">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase">Pending</span>
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-none">{stats.pendingCount || 0}</p>
      </div>
       <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded-lg border border-blue-100/50 dark:border-blue-900/20">
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
          <ShoppingCart className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase">Sales (Mo)</span>
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-slate-100 leading-none">{stats.currentMonthOrders || 0}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded-lg col-span-2 border border-green-100/50 dark:border-green-900/20">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">Rev (Mo)</span>
            </div>
             <p className="text-base font-black text-gray-900 dark:text-slate-100 leading-none">৳{(stats.currentMonthSales || 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

const UserStats = () => {
   // Empty string to trigger auto-detection of phone number in backend
  const { data, isLoading } = useGetUserDashboardStatsQuery("", { pollingInterval: 60000 });
  const lastOrder = data?.data?.recentOrders?.[0]; // Assuming API structure returns recentOrders in getStats? 
  // Wait, UserDashboardApi returns `getStats` which returns `orders` array directly?
  // Let's check UserDashboardController return format.
  
  if (isLoading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-5 h-5 text-primary" /></div>;
  
  // Checking UserDashboardService, it returns: 
  // { totalOrders, pendingOrders, ... , recentOrders: [...] }
  
  if (!lastOrder) return (
     <div className="p-4 text-center bg-bg-base rounded-lg border border-dashed border-border-main">
        <p className="text-xs text-text-muted">No orders yet</p>
     </div>
  );

  return (
    <div className="bg-gradient-to-r from-primary-blue/10 to-primary-green/10 p-3 rounded-xl border border-primary/10">
      <div className="flex items-center justify-between mb-2">
         <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Last Order Status</span>
         <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow-sm text-text-secondary">
            #{lastOrder._id?.slice(-6)}
         </span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${getStatusColorBg(lastOrder.status)}`}>
           <Package className={`w-5 h-5 ${getStatusColorText(lastOrder.status)}`} />
        </div>
        <div>
            <p className={`text-lg font-bold capitalize ${getStatusColorText(lastOrder.status)} leading-tight`}>
                {lastOrder.status}
            </p>
             <p className="text-xs font-semibold text-text-secondary">
                ৳{lastOrder.totalAmount?.toLocaleString()}
             </p>
        </div>
      </div>
    </div>
  );
};

// Helper for status colors
const getStatusColorBg = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-orange-100';
        case 'processing': return 'bg-blue-100';
        case 'delivered': return 'bg-green-100';
        case 'cancelled': return 'bg-red-100';
        default: return 'bg-gray-100';
    }
};
const getStatusColorText = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'text-orange-600';
        case 'processing': return 'text-blue-600';
        case 'delivered': return 'text-green-600';
        case 'cancelled': return 'text-red-600';
        default: return 'text-gray-600';
    }
}

export default UserMenuDropdown;
