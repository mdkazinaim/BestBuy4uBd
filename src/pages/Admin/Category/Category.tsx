import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
} from "@heroui/react";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
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

const Category = () => {
  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery({});
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalMode, setModalMode] = useState<"create" | "edit" | "subcategory">("create");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
  });

  const categories = categoriesData?.data || [];

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
    onOpen();
  };

  const handleSubmit = async () => {
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
                data: formData 
            }).unwrap();
            toast.success("Sub-category updated successfully");
        } else {
            await createSubCategory({ categoryId: selectedCategory._id, data: formData }).unwrap();
            toast.success("Sub-category added successfully");
        }
      }
      onOpenChange();
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-gray-500 text-sm">Organize products into categories and sub-categories</p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus size={18} />}
          onPress={() => handleOpenModal("create")}
        >
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <p>Loading categories...</p>
        ) : (
          categories.map((category: any) => (
            <Card key={category._id} className="border border-gray-100 shadow-sm">
              <CardBody className="p-0">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-xs text-gray-400 capitalize">{category.subCategories?.length || 0} Subcategories</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Plus size={14} />}
                      onPress={() => handleOpenModal("subcategory", category)}
                    >
                      Add Sub
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      onPress={() => handleOpenModal("edit", category)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => handleDeleteCategory(category._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {category.subCategories && category.subCategories.length > 0 && (
                  <div className="bg-gray-50/50 p-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {category.subCategories.map((sub: any, idx: number) => (
                        <div 
                          key={idx} 
                          className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                             <div className="min-w-8 h-8 rounded bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                {sub.image ? (
                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={14} className="text-gray-400" />
                                )}
                             </div>
                             <span className="text-sm font-medium truncate">{sub.name}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                onClick={() => handleOpenModal("subcategory", category, sub)}
                            >
                              <Edit size={12} />
                            </button>
                            <button 
                                className="p-1 hover:bg-red-50 rounded text-red-500"
                                onClick={() => handleDeleteSubCategory(category._id, sub.name)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalMode === "create" ? "Add New Category" : 
                 modalMode === "edit" ? "Edit Category" : 
                 selectedSubCategory ? "Edit Sub-category" : "Add Sub-category"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    variant="bordered"
                  />
                  <Input
                    label="Image URL"
                    placeholder="Enter image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    variant="bordered"
                  />
                  <Input
                    label="Description"
                    placeholder="Short description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    variant="bordered"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  {modalMode === "create" ? "Create" : "Save Changes"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Category;
