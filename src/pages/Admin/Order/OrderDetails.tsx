import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "@/store/Api/OrderApi";
import { Card, Chip, Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
} from "lucide-react";
import { useCreateSteadfastOrderMutation } from "@/store/Api/SteadfastApi";
import DashboardSkeleton from "@/common/Skeleton/DashboardSkeleton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
      // Align with backend payload structure
      const payload = {
        invoice: order.orderId?.toString() || order._id?.toString(), // Use orderId (human-readable) with fallback
        recipient_name: order.billingInformation?.name || order.name || "N/A",
        recipient_phone: order.billingInformation?.phone || order.phone || "N/A",
        recipient_address: order.billingInformation?.address || order.address || "N/A",
        // Always send totalAmount for COD orders (case-insensitive check)
        cod_amount: order.paymentMethod?.toLowerCase() === "cod" || 
                    order.paymentMethod?.toLowerCase() === "cash on delivery" 
                    ? order.totalAmount 
                    : 0,
        note: order.billingInformation?.notes || order.note || "Handle with care",
      };
      
      // Log payload for debugging
      console.log("Steadfast Payload:", JSON.stringify(payload, null, 2));
      
      const result = await createSteadfastOrder(payload).unwrap();
      toast.success(
        `Sent to Steadfast! Consignment ID: ${result?.consignment?.consignment_id}`
      );
      refetch(); // Refresh order details to show new status and disable button
    } catch (err: any) {
      console.error("Steadfast Error:", err);
      toast.error(err?.data?.message || "Failed to send to Steadfast");
    }
  };

  const handleCheckStatus = async () => {
    if (!order?.consignment_id) return;
    try {
        // We use fetch standardly but since checkSteadfastStatus is a query hook, 
        // we can trigger it manually or just use the lazy query if we had one.
        // For now, let's just use the fetch API directly to trigger the backend sync logic
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        const response = await fetch(`${baseUrl}/steadfast/status/${order.consignment_id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
        const result = await response.json();
        if(result.success){
            toast.success(`Status updated: ${result.data.delivery_status}`);
            refetch(); // Refresh order to show updated status
        } else {
            toast.error(result.message || "Failed to sync status");
        }
    } catch {
        toast.error("An error occurred while syncing status");
    }
  };

  const order = orderData?.data;

  const { register, handleSubmit, reset } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

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
    window.print();
  };

  if (isLoading) return <DashboardSkeleton />;

  if (!order)
    return <div className="p-10 text-center text-red-500">Order not found</div>;

  return (
    <div className="space-y-4 md:space-y-6 container mx-auto px-2 md:px-0 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="flat"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex flex-wrap items-center gap-2">
              Order #{order._id?.slice(-6).toUpperCase()}
              <Chip
                size="sm"
                color={(() => {
                  const s = order.status?.toLowerCase();
                  if (s?.includes("delivered")) return "success";
                  if (s?.includes("cancelled") || s?.includes("canceled"))
                    return "danger";
                  if (
                    s?.includes("processing") ||
                    s?.includes("shipped") ||
                    s === "in_review"
                  )
                    return "primary";
                  return "warning";
                })()}
                variant="flat"
              >
                {order.status
                  ?.split("_")
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Chip>
            </h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            color="secondary"
            size="sm"
            variant="flat"
            className="flex-1 md:flex-none"
            startContent={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Invoice
          </Button>
          <Button
            color="primary"
            size="sm"
            variant="flat"
            className="flex-1 md:flex-none"
            startContent={<Send className="w-4 h-4" />}
            onClick={handleSendToSteadfast}
            isLoading={isSteadfastLoading}
            isDisabled={!!order.consignment_id}
          >
            {order.consignment_id ? "Sent to Steadfast" : "Send to Steadfast"}
          </Button>
          {order.consignment_id && (
             <Button
                color="success"
                size="sm"
                variant="flat"
                className="flex-1 md:flex-none"
                startContent={<RefreshCw className="w-4 h-4" />}
                onClick={handleCheckStatus}
             >
                Check Courier Status
             </Button>
          )}
          <Button
            color="primary"
            size="sm"
            className="flex-1 md:flex-none"
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
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="p-3 md:p-4 shadow-sm border border-gray-100">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
              <Package className="w-4 h-5 md:w-5 md:h-5 text-gray-500" /> Order Items
            </h3>
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Product</th>
                    <th className="px-4 py-3 text-center">Unit Price</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-2 md:px-4 py-3 md:py-4 flex items-center gap-2 md:gap-3 lg:min-w-[300px]">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          {item.product?.images?.[0] && (
                            <img
                              src={typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.product?.basicInfo?.title || item.product?.title || "Product Deleted"}
                          </p>
                          {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(item.selectedVariants).map(([group, variant]: [string, any]) => (
                                Array.isArray(variant) ? (
                                  variant.map((v: any, vIdx: number) => (
                                    <Chip key={`${group}-${vIdx}`} size="sm" variant="flat" color="secondary" className="text-[10px] h-5">
                                      {group}: {v.value}
                                    </Chip>
                                  ))
                                ) : (
                                  <Chip key={group} size="sm" variant="flat" color="secondary" className="text-[10px] h-5">
                                    {group}: {variant.value}
                                  </Chip>
                                )
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {item.product?.basicInfo?.brand}
                          </p>
                        </div>
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm">
                        ৳{item.price?.toLocaleString()}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-center font-medium text-xs md:text-sm">
                        x {item.quantity}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-right font-bold text-xs md:text-sm">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-dashed border-gray-200">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-2 md:px-4 py-3 text-right text-gray-600 font-medium text-xs md:text-sm"
                    >
                      Subtotal
                    </td>
                    <td className="px-2 md:px-4 py-2 text-right font-bold text-gray-500 text-xs md:text-sm">
                      ৳{(order.totalAmount - (order.deliveryCharge || 0) + (order.discount || 0)).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      className="px-2 md:px-4 py-2 text-right text-gray-400 font-bold text-xs md:text-sm"
                    >
                      Shipping
                    </td>
                    <td className="px-2 md:px-4 py-2 text-right font-bold text-gray-500 text-xs md:text-sm">
                      {order.deliveryCharge ? `৳${order.deliveryCharge.toLocaleString()}` : 'Free'}
                    </td>
                  </tr>
                  {order.discount > 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-2 md:px-4 py-2 text-right text-red-400 font-bold text-xs md:text-sm"
                      >
                        Discount
                      </td>
                      <td className="px-2 md:px-4 py-2 text-right font-bold text-red-500 text-xs md:text-sm">
                        -৳{order.discount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td
                      colSpan={3}
                      className="px-2 md:px-4 py-4 text-right text-gray-900 font-black text-sm md:text-lg"
                    >
                      Total Amount
                    </td>
                    <td className="px-2 md:px-4 py-4 text-right font-black text-sm md:text-lg text-primary-link">
                      ৳{order.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Customer & Status */}
        <div className="space-y-4 md:space-y-6">
          {/* Status Card */}
          <Card className="p-3 md:p-5 shadow-sm border border-gray-100 border-l-4 border-l-primary-blue">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Order Status
            </h3>
            <div className="relative">
              <select
                {...register("status")}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-800 focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition-all cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Payment Method</span>
              <span className="font-bold text-gray-700 capitalize">
                {order.paymentMethod || "COD"}
              </span>
            </div>
          </Card>

          {/* Customer Info Card */}
          <Card className="p-3 md:p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" /> Customer Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    {...register("name")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 outline-none"
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    {...register("email")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 outline-none"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    {...register("phone")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 outline-none"
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-3 md:p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" /> Shipping Info
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full p-3 text-sm border border-gray-200 rounded-md focus:ring-1 outline-none"
                  placeholder="Address"
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  City / Region
                </label>
                <input
                  {...register("city")}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 outline-none"
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
