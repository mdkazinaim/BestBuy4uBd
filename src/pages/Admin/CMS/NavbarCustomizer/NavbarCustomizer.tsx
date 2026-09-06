import { Save, Eye } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";

export const NavbarCustomizer = () => {
  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Navbar & Header Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure sticky header behavior, main navigation items, search bar, and cart badges.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success("Navbar settings saved successfully")}
        >
          <Save className="w-4 h-4 mr-1.5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            <span>Enable Sticky Navbar on scroll</span>
          </label>

          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            <span>Show live instant search bar in header</span>
          </label>

          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            <span>Show user wishlist quick access icon</span>
          </label>

          <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
            <span>Display currency switcher</span>
          </label>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Header Layout Options
          </h4>
          <p className="text-xs text-slate-400">Main header links preview:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Home
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Products
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Categories
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Deals
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              Contact Us
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
