import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Sliders,
  LayoutGrid,
  Sparkles,
  Megaphone,
  PanelBottom,
  Navigation,
  ArrowLeft,
  X,
  Package2
} from "lucide-react";
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

import {
  BannerManagement,
  CategoryCustomizer,
  SectionCustomizer,
  ProductCardCustomizer,
  PromotionCustomizer,
  FooterCustomizer,
  NavbarCustomizer
} from ".";

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
        exit={{ opacity: 0, scale: 1, y: 0 }}
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
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const activeSection = section || "dashboard";

  // Top-level State and Hooks
  const { data: bannersData, isLoading } = useGetAllBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners: IBanner[] = bannersData?.data || [];

  const [isOpen, setIsOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Predefined product card selection state (default style 0 - storefront)
  const [selectedCardDesign, setSelectedCardDesign] = useState<number>(0);

  const { register, handleSubmit, reset, setValue } = useForm<IBanner>();

  useEffect(() => {
    if (editingBanner) {
      setValue("title", editingBanner.title);
      setValue("subtitle", editingBanner.subtitle);
      setValue("image", editingBanner.image);
      setValue("type", editingBanner.type);
      setValue("link", editingBanner.link);
      setValue("buttonText", editingBanner.buttonText);
      setValue("buttonBgColor", editingBanner.buttonBgColor || "#2563eb");
      setValue("buttonTextColor", editingBanner.buttonTextColor || "#ffffff");
      setValue("textColor", editingBanner.textColor || "#ffffff");
      setValue("textPosition", editingBanner.textPosition || "center");
      setValue("titleSize", editingBanner.titleSize || "2.5rem");
      setValue("subtitleSize", editingBanner.subtitleSize || "1.1rem");
      setValue("isActive", editingBanner.isActive ?? true);
      setValue("showButton", editingBanner.showButton ?? true);
      setValue("showTitle", editingBanner.showTitle ?? true);
    } else {
      reset({
        type: "hero",
        buttonBgColor: "#2563eb",
        buttonTextColor: "#ffffff",
        textColor: "#ffffff",
        textPosition: "center",
        titleSize: "2.5rem",
        subtitleSize: "1.1rem",
        isActive: true,
        showButton: true,
        showTitle: true,
      });
    }
  }, [editingBanner, setValue, reset]);

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

  const onSubmit = async (data: IBanner) => {
    try {
      if (editingBanner?._id) {
        await updateBanner({ id: editingBanner._id, data }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(data).unwrap();
        toast.success("Banner created successfully");
      }
      setIsOpen(false);
      setEditingBanner(null);
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteBanner(id).unwrap();
        toast.success("Banner deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete banner");
      }
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setIsOpen(true);
  };

  const openEditModal = (banner: IBanner) => {
    setEditingBanner(banner);
    setIsOpen(true);
  };

  const cmsCards = [
    {
      id: "banner",
      title: "Banner Management",
      description: "Manage hero sliders, promotional, and product row banners.",
      icon: Sliders,
      badgeText: `${banners.length} Banners`,
    },
    {
      id: "category",
      title: "Category Settings",
      description: "Organize home page featured categories and display ordering.",
      icon: LayoutGrid,
      badgeText: "Dynamic",
    },
    {
      id: "section",
      title: "Home Sections",
      description: "Manage New Arrival, Hot Deals, and Featured Product rows.",
      icon: Sparkles,
      badgeText: "3 Sections",
    },
    {
      id: "product_card",
      title: "Product Card Designs",
      description: "Select predefined product card layout for storefront.",
      icon: Package2,
      badgeText: "6 Predefined Styles",
    },
    {
      id: "promotion",
      title: "Promotions & Campaign",
      description: "Configure discount announcement bars and campaign rules.",
      icon: Megaphone,
      badgeText: "Active",
    },
    {
      id: "footer",
      title: "Footer Customization",
      description: "Edit footer quick links, social media handles, and copyright.",
      icon: PanelBottom,
      badgeText: "Global",
    },
    {
      id: "navbar",
      title: "Navbar & Header",
      description: "Customize sticky header, search bar, and top bar items.",
      icon: Navigation,
      badgeText: "Global",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section Navigation Header */}
      {activeSection !== "dashboard" && (
        <div className="flex items-center justify-between">
          <Link
            to="/admin/cms"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
            {activeSection.replace("_", " ")} Customizer
          </span>
        </div>
      )}

      {/* Main CMS Cards Dashboard Overview */}
      {activeSection === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cmsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(`/admin/cms/${card.id}`)}
                  className="group relative p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-500 group-hover:text-white transition-colors text-slate-700 dark:text-slate-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {card.badgeText}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div> 
      )}

      {/* Modular Section Subcomponents */}
      {activeSection === "banner" && (
        <BannerManagement
          banners={banners}
          isLoading={isLoading}
          onOpenCreateModal={openCreateModal}
          onOpenEditModal={openEditModal}
          onDeleteBanner={handleDeleteBanner}
          isDeleting={isDeleting}
        />
      )}

      {activeSection === "category" && <CategoryCustomizer />}

      {activeSection === "section" && <SectionCustomizer />}

      {activeSection === "product_card" && (
        <ProductCardCustomizer
          selectedCardDesign={selectedCardDesign}
          setSelectedCardDesign={setSelectedCardDesign}
        />
      )}

      {activeSection === "promotion" && <PromotionCustomizer />}

      {activeSection === "footer" && <FooterCustomizer />}

      {activeSection === "navbar" && <NavbarCustomizer />}

      {/* Modal Dialog Banner Form */}
      <AnimatePresence>
        {isOpen && (
          <CustomModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={editingBanner ? "Edit Banner Content" : "Create Content Banner"}
            footer={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={isUploading}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isCreating || isUpdating || isUploading}
                >
                  {isUploading
                    ? "Uploading..."
                    : isCreating || isUpdating
                    ? "Saving..."
                    : editingBanner
                    ? "Update Banner"
                    : "Create Banner"}
                </Button>
              </>
            }
          >
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Banner Type
                  </label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  >
                    <option value="hero">Hero Slider Banner</option>
                    <option value="product">Product Section Banner</option>
                    <option value="promotional">Promotional Grid Banner</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Link URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /products/smartphones"
                    {...register("link")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter main banner title"
                    {...register("title")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="Enter banner subtitle"
                    {...register("subtitle")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    {...register("image", { required: true })}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Or Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="w-full text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200/85 dark:hover:file:bg-slate-700/80 transition-all cursor-pointer h-10"
                    />
                    {isUploading && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 animate-pulse mt-1">
                        Uploading to Cloudinary...
                      </p>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Recommended: Hero (1200x500px), Product (400x500px), Promotional (1400x400px)
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SHOP NOW"
                    {...register("buttonText")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Text Position
                  </label>
                  <select
                    {...register("textPosition")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-medium">
                    Text Color
                  </label>
                  <div className="flex gap-2.5 items-center">
                    <input
                      type="color"
                      {...register("textColor")}
                      className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-400">Pick color</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Btn Bg
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        {...register("buttonBgColor")}
                        className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        Bg
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Btn Text
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        {...register("buttonTextColor")}
                        className="w-10 h-9 p-0.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        Text
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Title Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3rem"
                    {...register("titleSize")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Subtitle Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2rem"
                    {...register("subtitleSize")}
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      {...register("showTitle")}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                    />
                    <span>Show Title</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      {...register("showButton")}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                    />
                    <span>Show Button</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-sm font-medium">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-700 rounded focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
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
