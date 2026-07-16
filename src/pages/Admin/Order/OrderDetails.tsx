import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/store/Api/OrderApi";
import { Card, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Printer,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Send,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from "lucide-react";
import { useCreateSteadfastOrderMutation } from "@/store/Api/SteadfastApi";
import DashboardSkeleton from "@/common/Skeleton/DashboardSkeleton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const orderSchema = z.object({
  status: z.string().min(1, "Status is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
  {
    value: "delivered_approval_pending",
    label: "Delivered (Approval Pending)",
  },
  {
    value: "partial_delivered_approval_pending",
    label: "Partial Delivered (Approval Pending)",
  },
  {
    value: "cancelled_approval_pending",
    label: "Cancelled (Approval Pending)",
  },
  { value: "unknown_approval_pending", label: "Unknown (Approval Pending)" },
  { value: "partial_delivered", label: "Partial Delivered" },
  { value: "hold", label: "Hold" },
  { value: "in_review", label: "In Review" },
  { value: "unknown", label: "Unknown" },
];

// Custom Popover Select for Order Status
const OrderStatusPopover = ({
  currentStatus,
  onSelect,
}: {
  currentStatus: string;
  onSelect: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const currentOption = STATUS_OPTIONS.find((opt) => opt.value?.toLowerCase() === currentStatus?.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-between w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer text-sm"
        >
          <span>{currentOption?.label || currentStatus}</span>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg">
        <div className="max-h-64 overflow-y-auto no-scrollbar py-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                currentStatus?.toLowerCase() === opt.value?.toLowerCase()
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: orderData, isLoading, refetch } = useGetOrderByIdQuery(id);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [createSteadfastOrder, { isLoading: isSteadfastLoading }] =
    useCreateSteadfastOrderMutation();

  const handleSendToSteadfast = async () => {
    if (!order) return;
    try {
      const payload = {
        invoice: order.orderId?.toString() || order._id?.toString(),
        recipient_name: order.billingInformation?.name || order.name || "N/A",
        recipient_phone: order.billingInformation?.phone || order.phone || "N/A",
        recipient_address: order.billingInformation?.address || order.address || "N/A",
        cod_amount: order.paymentMethod?.toLowerCase() === "cod" || 
                    order.paymentMethod?.toLowerCase() === "cash on delivery" 
                    ? order.totalAmount 
                    : 0,
        note: order.billingInformation?.notes || order.note || "Handle with care",
      };
      
      console.log("Steadfast Payload:", JSON.stringify(payload, null, 2));
      const result = await createSteadfastOrder(payload).unwrap();
      toast.success(
        `Sent to Steadfast! Consignment ID: ${result?.consignment?.consignment_id}`
      );
      refetch();
    } catch (err: any) {
      console.error("Steadfast Error:", err);
      toast.error(err?.data?.message || "Failed to send to Steadfast");
    }
  };

  const handleCheckStatus = async () => {
    if (!order?.consignment_id) return;
    try {
      const getBaseUrl = () => {
        if (typeof window !== "undefined") {
          const hostname = window.location.hostname;
          if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:5000/api/v1";
          }
        }
        return "https://spark-tech-server.vercel.app/api/v1";
      };
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/steadfast/status/${order.consignment_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const result = await response.json();
      if(result.success){
        toast.success(`Status updated: ${result.data.delivery_status}`);
        refetch();
      } else {
        toast.error(result.message || "Failed to sync status");
      }
    } catch {
      toast.error("An error occurred while syncing status");
    }
  };

  const order = orderData?.data;

  const { register, handleSubmit, reset, setValue, watch } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

  const currentStatus = watch("status");

  useEffect(() => {
    if (order) {
      reset({
        status: order.status,
        name: order.billingInformation?.name,
        email: order.billingInformation?.email,
        phone: order.billingInformation?.phone,
        address: order.billingInformation?.address,
        city: order.billingInformation?.city || "",
      });
    }
  }, [order, reset]);

  const onSubmit = async (data: OrderFormValues) => {
    try {
      const updatePayload = {
        id,
        status: data.status,
        billingInformation: {
          ...order.billingInformation,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          paymentMethod:
            order.billingInformation?.paymentMethod ||
            order.paymentMethod ||
            "COD",
        },
      };
      await updateOrder(updatePayload).unwrap();
      toast.success("Order updated successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to update order");
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.open(`/admin/orders/invoice/${id}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    const formatStatus = (str: string) => {
      return str
        ?.split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    const formattedStatus = formatStatus(status);

    switch (s) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/20 text-green-800 dark:text-green-400">
            <CheckCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "partial_delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "processing":
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400">
            <Truck className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "in_review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "pending":
      case "hold":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "delivered_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-950/20 text-teal-800 dark:text-teal-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "partial_delivered_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-950/20 text-cyan-800 dark:text-cyan-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "cancelled_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "unknown_approval_pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950/20 text-purple-800 dark:text-purple-400">
            <Clock className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "cancelled":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400">
            <XCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      case "unknown":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-350">
            <XCircle className="w-3 h-3" /> {formattedStatus}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-300">
            {formattedStatus || status}
          </span>
        );
    }
  };

  if (isLoading) return <DashboardSkeleton />;
  if (!order)
    return <div className="p-10 text-center text-red-500 font-medium">Order not found</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="flat"
            onClick={() => navigate("/admin/orders")}
            className="rounded-lg border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold flex flex-wrap items-center gap-2 text-slate-800 dark:text-slate-100">
              Order #{order._id?.slice(-6).toUpperCase()}
              {getStatusBadge(order.status)}
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            color="secondary"
            size="sm"
            variant="flat"
            className="flex-1 md:flex-none rounded-lg font-semibold"
            startContent={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
          <Button
            color="primary"
            size="sm"
            variant="flat"
            className="flex-1 md:flex-none rounded-lg font-semibold"
            startContent={<Send className="w-4 h-4" />}
            onClick={handleSendToSteadfast}
            isLoading={isSteadfastLoading}
            disabled={!!order.consignment_id}
          >
            {order.consignment_id ? "Sent to Steadfast" : "Send to Steadfast"}
          </Button>
          {order.consignment_id && (
             <Button
                color="success"
                size="sm"
                variant="flat"
                className="flex-1 md:flex-none rounded-lg font-semibold"
                startContent={<RefreshCw className="w-4 h-4" />}
                onClick={handleCheckStatus}
             >
                Check Courier Status
             </Button>
          )}
          <Button
            color="primary"
            size="sm"
            className="flex-1 md:flex-none rounded-lg font-semibold"
            isLoading={isUpdating}
            startContent={<Save className="w-4 h-4" />}
            onClick={handleSubmit(onSubmit)}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
            <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Package className="w-4 h-5 text-slate-400" /> Order Items
            </h3>
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 font-semibold rounded-l-lg">Product</th>
                    <th className="px-4 py-3 font-semibold text-center">Unit Price</th>
                    <th className="px-4 py-3 font-semibold text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {order.items?.map((item: any, idx: number) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isEven ? "bg-white dark:bg-slate-900/10" : "bg-slate-50/20 dark:bg-slate-800/10"
                        }`}
                      >
                        <td className="px-4 py-4 flex items-center gap-3 lg:min-w-[300px]">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 overflow-hidden border border-slate-100 dark:border-slate-800">
                            {item.product?.images?.[0] && (
                              <img
                                src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                              {item.product?.basicInfo?.title || item.product?.title || "Product Deleted"}
                            </p>
                            {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(item.selectedVariants).map(([group, variant]: [string, any]) => (
                                  Array.isArray(variant) ? (
                                    variant.map((v: any, vIdx: number) => (
                                      <span key={`${group}-${vIdx}`} className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                                        {group}: {v.value}
                                      </span>
                                    ))
                                  ) : (
                                    <span key={group} className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                                      {group}: {variant.value}
                                    </span>
                                  )
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                              {item.product?.basicInfo?.brand}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-xs md:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          ৳{item.price?.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-xs md:text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          x {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-xs md:text-sm text-slate-800 dark:text-slate-100 whitespace-nowrap">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm"
                    >
                      Subtotal
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs md:text-sm">
                      ৳{(order.totalAmount - (order.deliveryCharge || 0) + (order.discount || 0)).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-right text-slate-500 dark:text-slate-400 font-semibold text-xs md:text-sm"
                    >
                      Shipping
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-600 dark:text-slate-300 text-xs md:text-sm">
                      {order.deliveryCharge ? `৳${order.deliveryCharge.toLocaleString()}` : 'Free'}
                    </td>
                  </tr>
                  {order.discount > 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-right text-red-400 dark:text-red-555 font-semibold text-xs md:text-sm"
                      >
                        Discount
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-red-500 dark:text-red-450 text-xs md:text-sm">
                        -৳{order.discount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-right text-slate-800 dark:text-slate-100 font-semibold text-sm md:text-base"
                    >
                      Total Amount
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-sm md:text-base text-blue-600 dark:text-blue-450">
                      ৳{order.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Customer & Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60 border-l-4 border-l-blue-500">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Order Status
            </h3>
            <div className="relative">
              <OrderStatusPopover
                currentStatus={currentStatus}
                onSelect={(val) => setValue("status", val)}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/65 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Payment Method</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                {order.paymentMethod || "COD"}
              </span>
            </div>
          </Card>

          {/* Customer Info Card */}
          <Card className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
            <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <User className="w-4 h-5 text-slate-400" /> Customer Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register("name")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register("email")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    {...register("phone")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none bg-white dark:bg-slate-900/60">
            <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-5 text-slate-400" /> Shipping Info
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full p-3 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none resize-none"
                  placeholder="Address"
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  City / Region
                </label>
                <input
                  {...register("city")}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-1 focus:ring-blue-500/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none"
                  placeholder="City"
                />
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default OrderDetails;
