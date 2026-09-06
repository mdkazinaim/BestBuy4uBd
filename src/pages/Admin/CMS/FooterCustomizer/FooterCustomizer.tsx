import { Save } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";

export const FooterCustomizer = () => {
  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Footer Customization Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage footer details, contact information, social links, and copyright text.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success("Footer configuration saved")}
        >
          <Save className="w-4 h-4 mr-1.5" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Footer About Summary
            </label>
            <textarea
              rows={3}
              defaultValue="Your premium destination for high quality tech products, gadgets, and accessories with fast delivery nationwide."
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Customer Support Phone
            </label>
            <input
              type="text"
              defaultValue="+880 1800-000000"
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Support Email Address
            </label>
            <input
              type="email"
              defaultValue="support@bestbuy4ubd.com"
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Copyright Text
            </label>
            <input
              type="text"
              defaultValue="© 2026 BestBuy4uBd. All Rights Reserved."
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Facebook Page URL
            </label>
            <input
              type="text"
              defaultValue="https://facebook.com/bestbuy4ubd"
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Instagram Handle
            </label>
            <input
              type="text"
              defaultValue="https://instagram.com/bestbuy4ubd"
              className="mt-1 w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
