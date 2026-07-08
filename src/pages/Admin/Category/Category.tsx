import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  FolderOpen,
} from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "@/store/Api/CategoriesApi";
import { toast } from "sonner";
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
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none overflow-hidden z-10 flex flex-col"
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

export default function Category() {
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "subcategory">("create");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const categories = useMemo(() => categoriesData?.data || [], [categoriesData]);

  const handleOpenModal = (mode: "create" | "edit" | "subcategory", category?: any, subCategory?: any) => {
    setModalMode(mode);
    setSelectedCategory(category || null);
    setSelectedSubCategory(subCategory || null);

    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        image: category.image || "",
        description: category.description || "",
      });
    } else if (mode === "subcategory" && subCategory) {
      setFormData({
        name: subCategory.name,
        image: subCategory.image || "",
        description: subCategory.description || "",
      });
    } else {
      setFormData({ name: "", image: "", description: "" });
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (modalMode === "create") {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully");
      } else if (modalMode === "edit") {
        await updateCategory({ id: selectedCategory._id, data: formData }).unwrap();
        toast.success("Category updated successfully");
      } else if (modalMode === "subcategory") {
        if (selectedSubCategory) {
          await updateSubCategory({
            categoryId: selectedCategory._id,
            subCategoryName: selectedSubCategory.name,
            data: formData,
          }).unwrap();
          toast.success("Sub-category updated successfully");
        } else {
          await createSubCategory({ categoryId: selectedCategory._id, data: formData }).unwrap();
          toast.success("Sub-category added successfully");
        }
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete");
      }
    }
  };

  const handleDeleteSubCategory = async (categoryId: string, subCategoryName: string) => {
    if (window.confirm("Are you sure you want to delete this sub-category?")) {
      try {
        await deleteSubCategory({ categoryId, subCategoryName }).unwrap();
        toast.success("Sub-category deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header - No internal padding, stretches full width */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-slate-500" />
            <span>Category Management</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Organize storefront products into categories and sub-categories
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleOpenModal("create")}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-12 text-sm font-medium text-slate-400 dark:text-slate-550">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-sm font-medium">
            No categories found. Click "Add Category" to get started.
          </div>
        ) : (
          categories.map((category: any) => (
            <div
              key={category._id}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden"
            >
              {/* Category Header Row */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-450 dark:text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-450 dark:text-slate-500 font-medium mt-0.5">
                      {category.subCategories?.length || 0} sub-categories
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenModal("subcategory", category)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sub</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenModal("edit", category)}
                    className="p-2 aspect-square flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category._id)}
                    className="p-2 aspect-square flex items-center justify-center hover:border-red-500/30 hover:bg-red-50/20"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Sub-categories Grid Area */}
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="bg-slate-50/40 dark:bg-slate-950/20 p-4 border-t border-slate-100 dark:border-slate-850">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {category.subCategories.map((sub: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-150 dark:border-slate-750 flex items-center justify-center overflow-hidden shrink-0">
                            {sub.image ? (
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {sub.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 cursor-pointer focus:outline-none"
                            onClick={() => handleOpenModal("subcategory", category, sub)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded text-red-500 cursor-pointer focus:outline-none"
                            onClick={() => handleDeleteSubCategory(category._id, sub.name)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <CustomModal
            isOpen={isOpen}
            onClose={handleCloseModal}
            title={
              modalMode === "create"
                ? "Add New Category"
                : modalMode === "edit"
                ? "Edit Category"
                : selectedSubCategory
                ? "Edit Sub-category"
                : "Add Sub-category"
            }
            footer={
              <>
                <Button variant="outline" size="sm" onClick={handleCloseModal} disabled={isUploading}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isUploading}>
                  {isUploading ? "Uploading..." : modalMode === "create" ? "Create" : "Save Changes"}
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-950/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
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
                  <p className="text-xs text-blue-650 dark:text-blue-400 animate-pulse mt-1">Uploading to Cloudinary...</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Description
                </label>
                <textarea
                  placeholder="Short description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-955/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-850 dark:text-slate-100 resize-none"
                />
              </div>
            </div>
          </CustomModal>
        )}
      </AnimatePresence>
    </div>
  );
}
