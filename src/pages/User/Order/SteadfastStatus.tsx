import { useCheckSteadfastStatusQuery } from "@/store/Api/SteadfastApi";
import { RefreshCw } from "lucide-react";


const SteadfastStatus = ({ consignmentId }: { consignmentId: string }) => {
    const { data, isLoading, refetch, isFetching } = useCheckSteadfastStatusQuery(consignmentId);
    
    if(!consignmentId) return null;
    if(isLoading) return <span className="text-xs text-gray-400">Loading courier status...</span>;

    const status = data?.data?.delivery_status;

    if(!status) return null;

    const getStatusConfig = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case "pending":
                return { label: "Pending", desc: "Consignment is not delivered or cancelled yet.", bg: "bg-yellow-50", text: "text-yellow-900", border: "border-yellow-100" };
            case "delivered_approval_pending":
                return { label: "Delivered (Approval Pending)", desc: "Consignment is delivered but waiting for admin approval.", bg: "bg-teal-50", text: "text-teal-900", border: "border-teal-100" };
            case "partial_delivered_approval_pending":
                return { label: "Partial Delivered (Approval Pending)", desc: "Consignment is delivered partially and waiting for admin approval.", bg: "bg-cyan-50", text: "text-cyan-900", border: "border-cyan-100" };
            case "cancelled_approval_pending":
                return { label: "Cancelled (Approval Pending)", desc: "Consignment is cancelled and waiting for admin approval.", bg: "bg-orange-50", text: "text-orange-900", border: "border-orange-100" };
            case "unknown_approval_pending":
                return { label: "Unknown (Approval Pending)", desc: "Unknown Pending status. Need contact with the support team.", bg: "bg-purple-50", text: "text-purple-900", border: "border-purple-100" };
            case "delivered":
                return { label: "Delivered", desc: "Consignment is delivered and balance added.", bg: "bg-green-50", text: "text-green-900", border: "border-green-100" };
            case "partial_delivered":
                return { label: "Partial Delivered", desc: "Consignment is partially delivered and balance added.", bg: "bg-emerald-50", text: "text-emerald-900", border: "border-emerald-100" };
            case "cancelled":
                return { label: "Cancelled", desc: "Consignment is cancelled and balance updated.", bg: "bg-red-50", text: "text-red-900", border: "border-red-100" };
            case "hold":
                return { label: "Hold", desc: "Consignment is held.", bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-100" };
            case "in_review":
                return { label: "In Review", desc: "Order is placed and waiting to be reviewed.", bg: "bg-indigo-50", text: "text-indigo-900", border: "border-indigo-100" };
            default:
                return { label: status, desc: "Status updated", bg: "bg-gray-50", text: "text-gray-900", border: "border-gray-100" };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className={`mt-3 p-3 rounded-lg border ${config.bg} ${config.border}`}>
            <div className="flex justify-between items-start mb-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${config.text} opacity-80`}>Courier Status</p>
                <button 
                    onClick={() => refetch()} 
                    disabled={isFetching}
                    className={`${config.text} opacity-60 hover:opacity-100 transition-opacity disabled:animate-spin`}
                    title="Refresh status"
                >
                    <RefreshCw size={12} />
                </button>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                    <span className={`font-semibold ${config.text}`}>{config.label}</span>
                    <span className={`text-[10px] ${config.text} opacity-75`}>Steadfast Courier</span>
                </div>
                {config.desc && (
                    <p className={`text-[10px] ${config.text} opacity-70`}>{config.desc}</p>
                )}
            </div>
        </div>
    );
};

export default SteadfastStatus;
