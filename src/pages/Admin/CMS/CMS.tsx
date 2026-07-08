import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Plus, Trash2, Image as ImageIcon, X, Sliders } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useUpdateBannerMutation,
  IBanner,
} from "@/store/Api/BannerApi";
import { Button } from "@/common/Components/Button";
import { uploadToCloudinary } from "@/utils/cloudinary";

// ============================================
// 📦 Custom Portal-based Dialog Modal Component
// ============================================
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const CustomModal = ({ isOpen, onClose, title, children, footer }: CustomModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none overflow-hidden z-10 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm md:text-base font-semibold text-slate-800 dark:text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 overflow-y-auto max-h-[70vh]">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          {footer}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default function CMS() {
  const { data: bannerResponse } = useGetAllBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setValue("image", url);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const { register, handleSubmit, reset, setValue } = useForm<Partial<IBanner>>();

  const banners = bannerResponse?.data || [];

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setValue("title", banner.title);
    setValue("subtitle", banner.subtitle);
    setValue("description", banner.description);
    setValue("type", banner.type);
    setValue("image", banner.image);
    setValue("link", banner.link);
    setValue("buttonText", banner.buttonText);
    setValue("buttonBgColor", banner.buttonBgColor);
    setValue("buttonTextColor", banner.buttonTextColor || "#FFFFFF");
    setValue("textColor", banner.textColor);
    setValue("textPosition", banner.textPosition || "center");
    setValue("titleSize", banner.titleSize);
    setValue("subtitleSize", banner.subtitleSize);
    setValue("showButton", banner.showButton !== undefined ? banner.showButton : true);
    setValue("showTitle", banner.showTitle !== undefined ? banner.showTitle : true);
    setValue("isActive", banner.isActive);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingBanner(null);
    reset();
    setIsOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(data).unwrap();
        toast.success("Banner created successfully");
      }
      setIsOpen(false);
      reset();
    } catch {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id).unwrap();
        toast.success("Banner deleted successfully");
      } catch {
        toast.error("Failed to delete banner");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header - No internal padding, stretches full width */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-slate-500" />
            <span>CMS Panel</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage storefront banners, hero sliders, and promotional section content
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </Button>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">IMAGE</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">TITLE</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">TYPE</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">STATUS</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                    No banners found
                  </td>
                </tr>
              ) : (
                banners.map((banner: IBanner) => (
                  <tr key={banner._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="p-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-150 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                        {banner.image ? (
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-[280px]">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{banner.title}</p>
                        <p className="text-xs text-slate-450 dark:text-slate-500 truncate mt-0.5">{banner.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${
                        banner.type === "hero"
                          ? "bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-450 border border-blue-200 dark:border-blue-900/50"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-750"
                      }`}>
                        {banner.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        banner.isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 border border-emerald-200/60 dark:border-emerald-900/40"
                          : "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-450 border border-red-200/60 dark:border-red-900/40"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(banner)}
                          className="p-2 aspect-square flex items-center justify-center"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(banner._id)}
                          className="p-2 aspect-square flex items-center justify-center hover:border-red-500/30 hover:bg-red-50/20"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-550" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Grid Layout */}
      <div className="lg:hidden space-y-4">
        {banners.map((banner: IBanner) => (
          <div
            key={banner._id}
            className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 p-4 space-y-3"
          >
            <div className="flex gap-3">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{banner.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                    banner.isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-450 border border-emerald-200/50"
                      : "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-450 border border-red-200/50"
                  }`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-1 mt-0.5">{banner.description}</p>
                <div className="mt-1.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                    banner.type === "hero"
                      ? "bg-blue-50 dark:bg-blue-950/20 text-blue-650 dark:text-blue-450 border border-blue-200/50"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border border-slate-200"
                  }`}>
                    {banner.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-850">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(banner)}
                className="flex items-center justify-center gap-1.5 h-8.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs">Edit</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(banner._id)}
                className="flex items-center justify-center gap-1.5 h-8.5 hover:border-red-500/30 hover:bg-red-50/20"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs text-red-500">Delete</span>
              </Button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-sm font-medium">
            No banners found
          </div>
        )}
      </div>

      {/* Modal Dialog Banner Form */}
      <AnimatePresence>
        {isOpen && (
          <CustomModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={editingBanner ? "Edit Banner Content" : "Create Content Banner"}
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isUploading}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreating || isUpdating || isUploading}
                >
                  {isUploading ? "Uploading..." : isCreating || isUpdating ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
                </Button>
              </>
            }
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Title</label>
                  <input
                    type="text"
                    placeholder="Enter banner title"
                    {...register("title")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Description</label>
                  <textarea
                    placeholder="Enter banner description"
                    {...register("description")}
                    rows={2}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Type</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  >
                    <option value="hero">Hero Slider</option>
                    <option value="product">Product Card</option>
                    <option value="promotional">Promotional Section</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Link URL</label>
                  <input
                    type="text"
                    placeholder="/products/..."
                    {...register("link")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Subtitle</label>
                  <input
                    type="text"
                    placeholder="Enter banner subtitle"
                    {...register("subtitle")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    {...register("image", { required: true })}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Or Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200/85 dark:hover:file:bg-slate-700/80 transition-all cursor-pointer h-10"
                    />
                    {isUploading && (
                      <p className="text-xs text-blue-650 dark:text-blue-400 animate-pulse mt-1">Uploading to Cloudinary...</p>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-505 font-medium">
                    Recommended: Hero (1200x500px), Product (400x500px), Promotional (1400x400px)
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. SHOP NOW"
                    {...register("buttonText")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-655 dark:text-slate-400">Text Position</label>
                  <select
                    {...register("textPosition")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400 font-medium">Text Color</label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="color"
                      {...register("textColor")}
                      className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-450">Pick color</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Btn Bg</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        {...register("buttonBgColor")}
                        className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500">Bg</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Btn Text</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        {...register("buttonTextColor")}
                        className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate-455 dark:text-slate-500">Text</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Title Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rem"
                    {...register("titleSize")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Subtitle Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2rem"
                    {...register("subtitleSize")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      {...register("showTitle")}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-slate-350 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                    />
                    <span>Show Title</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      {...register("showButton")}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-slate-350 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                    />
                    <span>Show Button</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-slate-350 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                    />
                    <span>Is Active</span>
                  </label>
                </div>
              </div>
            </form>
          </CustomModal>
        )}
      </AnimatePresence>
    </div>
  );
}
