import { useGetUserDashboardStatsQuery } from "@/store/Api/UserDashboardApi";
import { ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
    // Since this is a protected route, we fetch stats for the logged-in user.
    // We pass an empty string as phone, so the backend uses the authenticated user's info.
    const { data: statsResponse, isLoading } = useGetUserDashboardStatsQuery("");

    const stats = statsResponse?.data;

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading your dashboard...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">No dashboard data available.</div>
            </div>
        );
    }

    return (
        <div className="p-2 md:p-8">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-1">User Dashboard</h1>

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
                        <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase md:normal-case">Orders</p>
                                    <p className="text-lg md:text-2xl font-bold">{stats.overview.totalOrders}</p>
                                </div>
                                <div className="bg-blue-50 p-2 md:p-3 rounded-lg">
                                    <ShoppingBag className="text-blue-500 w-4 h-4 md:w-6 md:h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase md:normal-case">Pending</p>
                                    <p className="text-lg md:text-2xl font-bold">{stats.overview.pendingOrders}</p>
                                </div>
                                <div className="bg-yellow-50 p-2 md:p-3 rounded-lg">
                                    <Clock className="text-yellow-500 w-4 h-4 md:w-6 md:h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase md:normal-case">Delivered</p>
                                    <p className="text-lg md:text-2xl font-bold">{stats.overview.deliveredOrders}</p>
                                </div>
                                <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                                    <CheckCircle className="text-green-500 w-4 h-4 md:w-6 md:h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-[10px] md:text-sm font-bold uppercase md:normal-case">Spent</p>
                                    <p className="text-lg md:text-2xl font-bold">৳{stats.overview.totalSpent}</p>
                                </div>
                                <div className="bg-purple-50 p-2 md:p-3 rounded-lg">
                                    <span className="text-purple-500 text-sm md:text-xl font-bold">৳</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-3 md:p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-base md:text-lg font-semibold">Recent Orders</h2>
                        </div>
                        
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.orders.map((order: any) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                      'bg-blue-100 text-blue-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{order.totalAmount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.itemsCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-gray-100 px-1">
                            {stats.orders.map((order: any) => (
                                <div key={order._id} className="p-3 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-sm font-bold text-gray-900">৳{order.totalAmount}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full 
                                            ${order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                                              order.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 
                                              order.status === 'cancelled' ? 'bg-red-50 text-red-700' : 
                                              'bg-blue-50 text-blue-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                                        <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                                        <span className="font-medium bg-gray-100 px-1.5 py-0.5 rounded-md">{order.itemsCount} Items</span>
                                    </div>
                                </div>
                            ))}
                            {stats.orders.length === 0 && (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No orders yet
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


export default Dashboard;
