import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { IBanner } from "@/store/Api/BannerApi";

interface BannerManagementProps {
  banners: IBanner[];
  isLoading: boolean;
  onOpenCreateModal: () => void;
  onOpenEditModal: (banner: IBanner) => void;
  onDeleteBanner: (id: string) => void;
  isDeleting: boolean;
}

export const BannerManagement = ({
  banners,
  isLoading,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteBanner,
}: BannerManagementProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Banner Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, update, and manage slider and promotional banners for your store.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onOpenCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" /> Add New Banner
        </Button>
      </div>

      {/* Banner Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          <ImageIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Banners Created Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by adding your first hero or promotional banner to enhance your store's appearance.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={onOpenCreateModal}>
            <Plus className="w-4 h-4 mr-1.5" /> Create Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="group relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {banner.image ? (
                  <img
                    src={banner.image}
                    alt={banner.title || "Banner"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs uppercase tracking-wider">
                  {banner.type}
                </span>
                <span
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    banner.isActive !== false
                      ? "bg-emerald-500/90 text-white"
                      : "bg-slate-500/90 text-white"
                  }`}
                >
                  {banner.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {banner.title || "Untitled Banner"}
                  </h4>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                    {banner.link || "No link"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenEditModal(banner)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit banner"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteBanner(banner._id!)}
                      className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
