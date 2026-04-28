import { useState } from "react";
import { useGetOrderByIdQuery, useTrackOrderByPhoneQuery, useTrackOrderByConsignmentIdQuery } from "@/store/Api/OrderApi";
import { MapPin, Phone, Truck, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import SteadfastStatus from "./SteadfastStatus";

const Order = () => {
    const [searchType, setSearchType] = useState<"id" | "phone" | "consignment">("id");
    const [searchValue, setSearchValue] = useState("");
    const [triggerSearch, setTriggerSearch] = useState(false);

    // Queries
    const { data: orderById, isLoading: isLoadingId, isError: isErrorId } = useGetOrderByIdQuery(searchValue, {
        skip: !triggerSearch || searchType !== "id",
    });

    const { data: ordersByPhone, isLoading: isLoadingPhone, isError: isErrorPhone } = useTrackOrderByPhoneQuery(searchValue, {
        skip: !triggerSearch || searchType !== "phone",
    });

    const { data: orderByConsignment, isLoading: isLoadingConsignment, isError: isErrorConsignment } = useTrackOrderByConsignmentIdQuery(searchValue, {
        skip: !triggerSearch || searchType !== "consignment",
    });

    const isLoading = isLoadingId || isLoadingPhone || isLoadingConsignment;
    const isError = isErrorId || isErrorPhone || isErrorConsignment;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            toast.error("Please enter a value to search");
            return;
        }
        setTriggerSearch(true);
    };

    const orders = searchType === "id" 
        ? (orderById?.data ? [orderById.data] : []) 
        : searchType === "consignment"
        ? (orderByConsignment?.data ? [orderByConsignment.data] : [])
        : (ordersByPhone?.data || []);

    const OrderCard = ({ order }: { order: any }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold">Order #{order._id}</h3>
                    <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                        ${(() => {
                           const s = order.status?.toLowerCase();
                           if (s.includes('delivered')) return 'bg-green-100 text-green-800';
                           if (s.includes('pending') || s.includes('hold')) return 'bg-yellow-100 text-yellow-800';
                           if (s.includes('cancel')) return 'bg-red-100 text-red-800';
                           if (s.includes('processing') || s.includes('review')) return 'bg-blue-100 text-blue-800';
                           return 'bg-gray-100 text-gray-800';
                        })()}`}>
                        {order.status?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div className="mb-8 overflow-hidden">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                        const currentStatusIndex = statusOrder.indexOf(order.status.toLowerCase());
                        const isCompleted = index <= currentStatusIndex;
                        
                        return (
                            <div key={step} className="flex flex-col items-center bg-white px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {index === 0 && <Clock size={16} />}
                                    {index === 1 && <Clock size={16} />}
                                    {index === 2 && <Truck size={16} />}
                                    {index === 3 && <CheckCircle size={16} />}
                                </div>
                                <span className={`text-xs font-medium capitalize ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        Shipping Address
                    </h4>
                    <p className="text-gray-600 text-sm">{order.billingInformation?.name}</p>
                    <p className="text-gray-600 text-sm">{order.billingInformation?.address}</p>
                    <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                        <Phone size={14} />
                        {order.billingInformation?.phone}
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>৳{order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Fee</span>
                            <span>৳{order.courierCharge === 'insideDhaka' ? 80 : 150}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>৳{order.totalAmount}</span>
                        </div>
                        {order.consignment_id && <SteadfastStatus consignmentId={order.consignment_id} />}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Track Your Order</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => { setSearchType("id"); setTriggerSearch(false); setSearchValue(""); }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${searchType === "id" ? "bg-primary-green text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        By Order ID
                    </button>
                    <button
                        onClick={() => { setSearchType("phone"); setTriggerSearch(false); setSearchValue(""); }}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${searchType === "phone" ? "bg-primary-green text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        By Phone
                    </button>
                    <button
                        onClick={() => { setSearchType("consignment"); setTriggerSearch(false); setSearchValue(""); }}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${searchType === "consignment" ? "bg-primary-green text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        By Steadfast ID
                    </button>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type={searchType === "phone" ? "tel" : "text"}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={
                            searchType === "id" ? "Enter Order ID" : 
                            searchType === "consignment" ? "Enter Steadfast ID (e.g. CID...)" :
                            "Enter Phone Number"
                        }
                        className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-primary-green text-white px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Track
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-gray-500"
                    >
                        Searching for your order...
                    </motion.div>
                )}

                {!isLoading && isError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-red-500 bg-red-50 rounded-xl"
                    >
                        Something went wrong while searching. Please try again.
                    </motion.div>
                )}

                {!isLoading && !isError && triggerSearch && orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-red-500 bg-red-50 rounded-xl"
                    >
                        No orders found. Please check your {searchType === "id" ? "Order ID" : "Phone Number"} and try again.
                    </motion.div>
                )}

                {orders.map((order: any) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <OrderCard order={order} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Order;
