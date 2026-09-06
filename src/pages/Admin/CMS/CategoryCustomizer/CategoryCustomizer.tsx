import { Save, Plus } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";

export const CategoryCustomizer = () => {
  const categoriesList = [
    { name: "Smartphones & Tablets", count: "48 Products", featured: true },
    { name: "Laptops & Computers", count: "32 Products", featured: true },
    { name: "Smart Watches & Wearables", count: "24 Products", featured: true },
    { name: "Audio & Headphones", count: "19 Products", featured: false },
    { name: "Camera & Photography", count: "12 Products", featured: false },
    { name: "Gaming Accessories", count: "29 Products", featured: true },
  ];

  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Category Display Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize home page featured categories, display icons, and order hierarchy.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success("Category layout settings saved")}
        >
          <Save className="w-4 h-4 mr-1.5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesList.map((cat, idx) => (
          <div
            key={idx}
            className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {cat.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={cat.featured}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Home Grid
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add New Category Highlight
        </Button>
      </div>
    </div>
  );
};
