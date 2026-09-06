import { Save } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";

export const PromotionCustomizer = () => {
  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Promotions & Campaign Bar Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure promotional discount banners, ticker messages, and sale badges.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success("Promotion settings saved")}
        >
          <Save className="w-4 h-4 mr-1.5" /> Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Top Announcement Banner Text
            </label>
            <input
              type="text"
              defaultValue="🔥 Special Offer: Free Express Shipping on orders over $50!"
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Banner Background Color
            </label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                defaultValue="#2563eb"
                className="w-10 h-9 p-0.5 border border-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-xs text-slate-500">Hex Color Code</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Coupon Code / Link
            </label>
            <input
              type="text"
              defaultValue="PROMO2026"
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/40 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Top Bar Live Preview
          </h4>
          <div className="bg-blue-600 text-white text-xs py-2 px-4 rounded-lg flex items-center justify-between">
            <span>🔥 Special Offer: Free Express Shipping on orders over $50!</span>
            <span className="underline font-bold cursor-pointer">Shop Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
