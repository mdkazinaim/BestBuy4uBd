import { Save } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";

export const SectionCustomizer = () => {
  const sectionsList = [
    {
      id: "new_arrival",
      title: "New Arrival",
      desc: "Customize the recent products collection row on home page.",
      defaultTitle: "⚡ New Arrivals",
      layoutOptions: ["Grid (4 Columns)", "Grid (5 Columns)", "Horizontal Carousel"],
      itemLimit: 8,
    },
    {
      id: "hot_deals",
      title: "Hot Deals & Flash Sale",
      desc: "High priority discounted items with live countdown timer.",
      defaultTitle: "🔥 Flash Hot Deals",
      layoutOptions: ["Banner + Grid Split", "Full Width Grid", "Carousel"],
      itemLimit: 6,
    },
    {
      id: "featured_product",
      title: "Featured Products",
      desc: "Curated list of premium hand-picked products.",
      defaultTitle: "⭐ Featured Products",
      layoutOptions: ["Grid (4 Columns)", "Tabbed Category View", "Hero Grid"],
      itemLimit: 12,
    },
  ];

  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Home Page Sections Customizer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure section titles, visibility, max items displayed, and layout styles for New Arrival, Hot Deals, and Featured Products.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success("Section layout configurations saved!")}
        >
          <Save className="w-4 h-4 mr-1.5" /> Save All Sections
        </Button>
      </div>

      <div className="space-y-6">
        {sectionsList.map((sectionItem) => (
          <div
            key={sectionItem.id}
            className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {sectionItem.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sectionItem.desc}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                  />
                  <span>Enable Section</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Display Section Title
                </label>
                <input
                  type="text"
                  defaultValue={sectionItem.defaultTitle}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Layout Format
                </label>
                <select className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20">
                  {sectionItem.layoutOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Max Display Products
                </label>
                <input
                  type="number"
                  defaultValue={sectionItem.itemLimit}
                  className="mt-1 w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
