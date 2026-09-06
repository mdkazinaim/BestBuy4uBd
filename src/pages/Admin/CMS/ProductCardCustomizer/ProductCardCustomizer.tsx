import { useState, useEffect } from "react";
import { Grid, Sparkles } from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";
import {
  Style0Card,
  Style1Card,
  Style2Card,
  Style3Card,
  Style4Card,
  Style5Card,
  Style6Card,
  Style7Card,
  Style8Card,
  Style9Card,
  CustomCardBuilder,
  RenderCustomCardPreview,
} from "./Components";

interface ProductCardCustomizerProps {
  selectedCardDesign: number;
  setSelectedCardDesign: (id: number) => void;
}

export const ProductCardCustomizer = ({
  selectedCardDesign,
  setSelectedCardDesign,
}: ProductCardCustomizerProps) => {
  const [activeTab, setActiveTab] = useState<"predefined" | "builder">("predefined");
  const [customSavedConfig, setCustomSavedConfig] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("custom_product_card_builder");
      if (saved) {
        setCustomSavedConfig(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  const sampleProduct = {
    _id: "demo-1",
    basicInfo: {
      title: "Extonic ET-C702 Portable Air Cooler Fan – Powerful Cooling Fan (Green)",
      category: "GADGETS",
    },
    price: {
      regular: 2250,
      discounted: 1750,
    },
    images: [
      { url: "https://images.unsplash.com/photo-1617625802912-cde588faf581?w=600&q=80" },
    ],
    stockStatus: "In Stock",
  };

  const predefinedDesigns = [
    {
      id: 0,
      name: "Style 0 - Current Storefront Card",
      badgeText: "Current Active",
      render: () => <Style0Card sampleProduct={sampleProduct} />,
    },
    {
      id: 1,
      name: "Style 1 - Clean Rounded Pill",
      badgeText: "Popular",
      render: () => <Style1Card />,
    },
    {
      id: 2,
      name: "Style 2 - Full Image Poster",
      badgeText: "Fashion & Apparel",
      render: () => <Style2Card />,
    },
    {
      id: 3,
      name: "Style 3 - Double Action Buttons",
      badgeText: "High Conversion",
      render: () => <Style3Card />,
    },
    {
      id: 4,
      name: "Style 4 - Minimalist Card",
      badgeText: "Simple Clean",
      render: () => <Style4Card />,
    },
    {
      id: 5,
      name: "Style 5 - Dual Color Action Stack",
      badgeText: "Gadgets & Electronics",
      render: () => <Style5Card />,
    },
    {
      id: 6,
      name: "Style 6 - Side Floating Actions",
      badgeText: "Ref Card 1",
      render: () => <Style6Card />,
    },
    {
      id: 7,
      name: "Style 7 - Minimalist Circle Badge",
      badgeText: "Ref Card 2",
      render: () => <Style7Card />,
    },
    {
      id: 8,
      name: "Style 8 - Pack Header Banner",
      badgeText: "Ref Card 3",
      render: () => <Style8Card />,
    },
    {
      id: 9,
      name: "Style 9 - Poster Apparel Card",
      badgeText: "Ref Card 4",
      render: () => <Style9Card />,
    },
    {
      id: 10,
      name: "Style 10 - Custom Studio Card",
      badgeText: "Custom Built",
      render: () =>
        customSavedConfig ? (
          <RenderCustomCardPreview config={customSavedConfig} />
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="w-6 h-6 text-purple-500 mb-2 animate-bounce" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No Saved Custom Card
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Go to Custom Card Studio tab to design & save your layout.
            </p>
          </div>
        ),
    },
  ];

  return (
    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-6">
      {/* Header & Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Storefront Product Card Customizer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose from predefined designs or construct a custom card layout using component layers.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("predefined")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "predefined"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" /> Predefined Templates
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "builder"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" /> Custom Card Studio
          </button>
        </div>
      </div>

      {/* Predefined Templates Grid Mode */}
      {activeTab === "predefined" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {predefinedDesigns.map((design) => {
              const isSelected = selectedCardDesign === design.id;
              return (
                <div
                  key={design.id}
                  onClick={() => setSelectedCardDesign(design.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full w-fit ${
                    isSelected
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-center justify-between h-7 mb-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                      {design.name}
                    </span>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                        {design.badgeText}
                      </span>
                    )}
                  </div>

                  <div className="py-1 flex-1 flex flex-col justify-between h-full">
                    {design.render()}
                  </div>

                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    className="w-full text-xs cursor-pointer mt-4 flex items-center justify-center gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCardDesign(design.id);
                      setActiveTab("builder");
                      toast.success(`Opening Custom Card Studio for ${design.name}`);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Customize This Card
                      </>
                    ) : (
                      "Select & Customize"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Custom Card Builder Studio Mode */}
      {activeTab === "builder" && <CustomCardBuilder />}
    </div>
  );
};
