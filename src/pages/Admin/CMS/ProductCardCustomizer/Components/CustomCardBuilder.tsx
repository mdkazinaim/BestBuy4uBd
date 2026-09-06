import React, { useState, useRef } from "react";
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  Maximize2,
  LayoutGrid,
  Image as ImageIcon,
  Heart,
  Tag,
  Type,
  DollarSign,
  CheckCircle2,
  MousePointer,
  Box,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlignCenter
} from "lucide-react";
import { Button } from "@/common/Components/Button";
import { toast } from "sonner";
import {
  CardBadge,
  WishlistButton,
  CategoryLabel,
  ProductTitle,
  PriceDisplay,
  StockBadge,
  ActionButtons,
} from "../Common";

export interface CanvasElement {
  id: string;
  type: "image" | "badge" | "wishlist" | "category" | "title" | "price" | "stock" | "actions";
  title: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex: number;
  props: Record<string, any>;
}

export const CustomCardBuilder = () => {
  const sampleProduct = {
    title: "Extonic ET-C702 Portable Air Cooler Fan – Powerful Cooling Fan (Green)",
    category: "GADGETS & ELECTRONICS",
    regularPrice: 2250,
    discountedPrice: 1750,
    imageUrl: "https://images.unsplash.com/photo-1617625802912-cde588faf581?w=600&q=80",
    stockStatus: "In Stock",
  };

  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: "el-image",
      type: "image",
      title: "Product Image",
      x: 0,
      y: 0,
      width: 290,
      height: 220,
      zIndex: 1,
      props: { fit: "cover", rounded: "rounded-xl" },
    },
    {
      id: "el-badge",
      type: "badge",
      title: "Discount Tag",
      x: 12,
      y: 12,
      zIndex: 10,
      props: { text: "25% OFF", variant: "rect" },
    },
    {
      id: "el-wishlist",
      type: "wishlist",
      title: "Wishlist Heart",
      x: 245,
      y: 12,
      zIndex: 10,
      props: {},
    },
    {
      id: "el-category",
      type: "category",
      title: "Category Label",
      x: 12,
      y: 235,
      zIndex: 2,
      props: { align: "left" },
    },
    {
      id: "el-title",
      type: "title",
      title: "Product Title",
      x: 12,
      y: 255,
      zIndex: 2,
      props: { lines: 2, align: "left" },
    },
    {
      id: "el-price",
      type: "price",
      title: "Price Tag",
      x: 12,
      y: 315,
      zIndex: 2,
      props: { align: "left" },
    },
    {
      id: "el-stock",
      type: "stock",
      title: "Stock Tag",
      x: 200,
      y: 315,
      zIndex: 2,
      props: {},
    },
    {
      id: "el-actions",
      type: "actions",
      title: "Action Button",
      x: 12,
      y: 360,
      width: 266,
      height: 40,
      zIndex: 5,
      props: { variant: "eye-order", primaryText: "অর্ডার করুন" },
    },
  ]);

  const [cardBorderRadius, setCardBorderRadius] = useState<"rounded-none" | "rounded-lg" | "rounded-xl" | "rounded-2xl">("rounded-xl");
  const [cardShadow, setCardShadow] = useState<"shadow-none" | "shadow-xs" | "shadow-md" | "shadow-lg">("shadow-xs");
  const [cardPadding, setCardPadding] = useState<"p-2" | "p-3" | "p-4">("p-3");
  const [cardWidth, setCardWidth] = useState<number>(310);
  const [cardHeight, setCardHeight] = useState<number>(450);

  const [selectedId, setSelectedId] = useState<string | null>("el-image");
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState<{ x: number; y: number; width?: number; height?: number }>({
    x: 0,
    y: 0,
  });

  const [isCardResizing, setIsCardResizing] = useState(false);
  const [cardResizeStart, setCardResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 310,
    height: 450,
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedElement = elements.find((el) => el.id === selectedId);

  const paletteItems = [
    { type: "image", title: "Product Image Container", icon: ImageIcon },
    { type: "badge", title: "Discount Badge Tag", icon: Tag },
    { type: "wishlist", title: "Wishlist Heart Icon", icon: Heart },
    { type: "category", title: "Category Label", icon: LayoutGrid },
    { type: "title", title: "Product Title Header", icon: Type },
    { type: "price", title: "Price Tag", icon: DollarSign },
    { type: "stock", title: "Stock Status Tag", icon: CheckCircle2 },
    { type: "actions", title: "CTA Action Buttons", icon: MousePointer },
  ];

  const handleAddComponent = (type: string, title: string) => {
    const newId = `el-${Date.now()}`;
    const newEl: CanvasElement = {
      id: newId,
      type: type as any,
      title,
      x: 20,
      y: 20 + elements.length * 15,
      width: type === "image" ? 290 : type === "actions" ? 250 : undefined,
      height: type === "image" ? 220 : type === "actions" ? 40 : undefined,
      zIndex: elements.length + 1,
      props: {
        align: "left",
        text: "NEW TAG",
        variant: "rect",
        primaryText: "অর্ডার করুন",
        lines: 2,
      },
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newId);
    toast.success(`Added ${title} to Canvas!`);
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    toast.success("Element removed from canvas");
  };

  const handleResizeCardStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCardResizing(true);
    setCardResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: cardWidth,
      height: cardHeight,
    });
  };

  const handleCenterElement = (axis: "x" | "y" | "both") => {
    if (!selectedId) return;
    const currentEl = elements.find((el) => el.id === selectedId);
    if (!currentEl) return;

    // Use actual DOM width if available, otherwise sensible default by type
    let elementWidth = currentEl.width;
    if (!elementWidth) {
      if (currentEl.type === "image") elementWidth = 290;
      else if (currentEl.type === "actions") elementWidth = 266;
      else if (currentEl.type === "title") elementWidth = 265;
      else if (currentEl.type === "category") elementWidth = 140;
      else if (currentEl.type === "price") elementWidth = 120;
      else if (currentEl.type === "badge") elementWidth = 70;
      else if (currentEl.type === "stock") elementWidth = 65;
      else if (currentEl.type === "wishlist") elementWidth = 32;
      else elementWidth = 100;
    }

    let elementHeight = currentEl.height;
    if (!elementHeight) {
      if (currentEl.type === "image") elementHeight = 220;
      else if (currentEl.type === "actions") elementHeight = 40;
      else elementHeight = 28;
    }

    const centerX = Math.max(0, Math.round((cardWidth - elementWidth) / 2));
    const centerY = Math.max(0, Math.round((cardHeight - elementHeight) / 2));

    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedId) return el;
        return {
          ...el,
          x: axis === "x" || axis === "both" ? centerX : el.x,
          y: axis === "y" || axis === "both" ? centerY : el.y,
        };
      })
    );
  };

  const handleMouseDownElement = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    const target = elements.find((el) => el.id === id);
    if (target) {
      setElementStartPos({ x: target.x, y: target.y });
    }
  };

  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    const target = elements.find((el) => el.id === id);
    if (target) {
      setElementStartPos({
        x: target.x,
        y: target.y,
        width: target.width || 200,
        height: target.height || 150,
      });
    }
  };

  // Window-level mouse listeners so dragging doesn't break if pointer leaves canvas fast
  React.useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isCardResizing) {
        const deltaX = e.clientX - cardResizeStart.x;
        const deltaY = e.clientY - cardResizeStart.y;
        setCardWidth(Math.max(200, Math.min(420, cardResizeStart.width + deltaX)));
        setCardHeight(Math.max(250, Math.min(600, cardResizeStart.height + deltaY)));
        return;
      }

      if (!selectedId) return;

      const currentEl = elements.find((el) => el.id === selectedId);
      if (!currentEl) return;

      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const elementWidth = currentEl.width || (currentEl.type === "image" ? 290 : 100);
        const elementHeight = currentEl.height || (currentEl.type === "image" ? 220 : 30);

        const maxX = Math.max(0, cardWidth - elementWidth);
        const maxY = Math.max(0, cardHeight - elementHeight);

        const clampedX = Math.max(0, Math.min(maxX, elementStartPos.x + deltaX));
        const clampedY = Math.max(0, Math.min(maxY, elementStartPos.y + deltaY));

        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedId
              ? {
                  ...el,
                  x: clampedX,
                  y: clampedY,
                }
              : el
          )
        );
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const maxWidth = cardWidth - currentEl.x;
        const maxHeight = cardHeight - currentEl.y;

        const clampedWidth = Math.max(40, Math.min(maxWidth, (elementStartPos.width || 100) + deltaX));
        const clampedHeight = Math.max(25, Math.min(maxHeight, (elementStartPos.height || 100) + deltaY));

        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedId
              ? {
                  ...el,
                  width: clampedWidth,
                  height: clampedHeight,
                }
              : el
          )
        );
      }
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsCardResizing(false);
    };

    if (isDragging || isResizing || isCardResizing) {
      window.addEventListener("mousemove", handleWindowMouseMove);
      window.addEventListener("mouseup", handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, isResizing, isCardResizing, selectedId, dragStart, elementStartPos, cardResizeStart, cardWidth, cardHeight, elements]);

  const updateSelectedProp = (key: string, value: any) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? {
              ...el,
              props: { ...el.props, [key]: value },
            }
          : el
      )
    );
  };

  const renderComponentInsideCanvas = (el: CanvasElement) => {
    return (
      <div className="pointer-events-none" style={{ width: el.width ? `${el.width}px` : undefined, height: el.height ? `${el.height}px` : undefined }}>
        {(() => {
          switch (el.type) {
            case "image":
              return (
                <div
                  style={{ width: el.width || 290, height: el.height || 220 }}
                  className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-xs flex items-center justify-center"
                >
                  <img
                    src={sampleProduct.imageUrl}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80";
                    }}
                    alt={sampleProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              );

            case "badge":
              return (
                <CardBadge
                  text={el.props.text || "25% OFF"}
                  variant={el.props.variant || "rect"}
                />
              );

            case "wishlist":
              return <WishlistButton />;

            case "category":
              return (
                <CategoryLabel
                  category={sampleProduct.category}
                  align={el.props.align || "left"}
                />
              );

            case "title":
              return (
                <div style={{ width: "100%", height: "100%" }}>
                  <ProductTitle
                    title={sampleProduct.title}
                    lines={el.props.lines ?? 0}
                    align={el.props.align || "left"}
                  />
                </div>
              );

            case "price":
              return (
                <PriceDisplay
                  regularPrice={sampleProduct.regularPrice}
                  discountedPrice={sampleProduct.discountedPrice}
                  align={el.props.align || "left"}
                />
              );

            case "stock":
              return <StockBadge status={sampleProduct.stockStatus} />;

            case "actions":
              return (
                <div style={{ width: el.width || 266, height: el.height || 40 }}>
                  <ActionButtons
                    variant={el.props.variant || "eye-order"}
                    primaryText={el.props.primaryText || "অর্ডার করুন"}
                    secondaryText="ADD TO CART"
                  />
                </div>
              );

            default:
              return null;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 1. Left Component Palette */}
      <div className="lg:col-span-3 space-y-4">
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Plus className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Component Palette
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Click any block to add it directly onto your interactive card canvas.
          </p>

          <div className="space-y-2 pt-1">
            {paletteItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = selectedElement?.type === item.type;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const existing = elements.find((el) => el.type === item.type);
                    if (existing) {
                      setSelectedId(existing.id);
                    } else {
                      handleAddComponent(item.type, item.title);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer group ${
                    isActive
                      ? "border-secondary bg-secondary/10 dark:bg-secondary/20 shadow-xs ring-1 ring-secondary"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-secondary/10 hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-secondary text-white"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-secondary group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isActive
                          ? "text-secondary font-bold"
                          : "text-slate-700 dark:text-slate-200 group-hover:text-secondary"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Outer Container Settings */}
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Box className="w-4 h-4 text-secondary" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Container Box
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Card Width (px)</label>
                <input
                  type="number"
                  value={cardWidth}
                  onChange={(e) => setCardWidth(Math.max(200, Math.min(420, Number(e.target.value))))}
                  className="mt-1 w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Card Height (px)</label>
                <input
                  type="number"
                  value={cardHeight}
                  onChange={(e) => setCardHeight(Math.max(250, Math.min(600, Number(e.target.value))))}
                  className="mt-1 w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Border Radius</label>
              <select
                value={cardBorderRadius}
                onChange={(e: any) => setCardBorderRadius(e.target.value)}
                className="mt-1 w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="rounded-none">Square (No radius)</option>
                <option value="rounded-lg">Rounded Medium</option>
                <option value="rounded-xl">Rounded Large (Default)</option>
                <option value="rounded-2xl">Extra Rounded 2XL</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Elevation Shadow</label>
              <select
                value={cardShadow}
                onChange={(e: any) => setCardShadow(e.target.value)}
                className="mt-1 w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="shadow-none">Flat (No Shadow)</option>
                <option value="shadow-xs">Subtle Shadow</option>
                <option value="shadow-md">Medium Shadow</option>
                <option value="shadow-lg">Prominent Shadow</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Inner Padding</label>
              <select
                value={cardPadding}
                onChange={(e: any) => setCardPadding(e.target.value)}
                className="mt-1 w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                <option value="p-2">Small Padding (p-2)</option>
                <option value="p-3">Medium Padding (p-3)</option>
                <option value="p-4">Large Padding (p-4)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Interactive Freeform Drag & Resize Studio Canvas */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Interactive Canvas Studio
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
              Drag & Resize Enabled
            </span>
          </div>

          {/* Interactive Freeform Canvas Container */}
          <div
            ref={canvasRef}
            onClick={() => setSelectedId(null)}
            className="relative w-full h-[470px] bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden flex justify-center items-center select-none cursor-default"
          >
            {/* Outer Product Card Frame */}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
              className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all ${cardBorderRadius} ${cardShadow} ${cardPadding}`}
            >
              {/* Card Container Freeform Drag-to-Resize Handle */}
              <div
                onMouseDown={handleResizeCardStart}
                className="absolute bottom-0 right-0 w-6 h-6 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-tl-xl flex items-center justify-center cursor-se-resize z-40 shadow-md hover:scale-110 transition-transform"
                title="Drag by hand to resize Card Container width & height"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
              {elements.map((el) => {
                const isSelected = selectedId === el.id;
                // Convert Hex color + opacity into RGBA string so opacity applies ONLY to background
                const hexToRgba = (hex?: string, alphaPercent: number = 100) => {
                  if (!hex) return undefined;
                  const alpha = alphaPercent / 100;
                  let cleanHex = hex.replace("#", "");
                  if (cleanHex.length === 3) {
                    cleanHex = cleanHex.split("").map((c) => c + c).join("");
                  }
                  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
                  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
                  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
                  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                };

                const computedBgColor = el.props.bgColor
                  ? hexToRgba(el.props.bgColor, el.props.opacity ?? 100)
                  : undefined;

                const computedBorderColor = el.props.borderColor || undefined;
                const computedShadow = el.props.shadow || undefined;

                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleMouseDownElement(e, el.id)}
                    style={{
                      position: "absolute",
                      left: `${el.x}px`,
                      top: `${el.y}px`,
                      width: el.width ? `${el.width}px` : undefined,
                      height: el.height ? `${el.height}px` : undefined,
                      zIndex: el.zIndex,
                      backgroundColor: computedBgColor,
                      borderColor: computedBorderColor,
                      borderWidth: computedBorderColor ? "1px" : undefined,
                      borderStyle: computedBorderColor ? "solid" : undefined,
                      boxShadow: computedShadow,
                      borderRadius: el.props.borderRadius !== undefined ? `${el.props.borderRadius}px` : undefined,
                      padding: el.props.padding !== undefined ? `${el.props.padding}px` : undefined,
                    }}
                    className={`group/el cursor-move transition-shadow ${
                      isSelected
                        ? "ring-2 ring-secondary ring-offset-1 shadow-lg"
                        : "hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-700"
                    }`}
                  >
                    {/* Rendered Component with Overflow Clipped inside */}
                    <div className="w-full h-full overflow-hidden">
                      {renderComponentInsideCanvas(el)}
                    </div>

                    {/* Resize Handle on corner for ALL canvas elements - On Top */}
                    {isSelected && (
                      <div
                        onMouseDown={(e) => handleResizeStart(e, el.id)}
                        className="absolute -bottom-3 -right-3 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center cursor-nwse-resize z-50 shadow-lg hover:scale-125 transition-transform"
                        title="Drag handle to resize width and height"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Delete Quick Action Control - On Top */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteElement(el.id);
                        }}
                        className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer z-50 shadow-lg hover:scale-110 transition-transform font-bold text-xs"
                        title="Delete layer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs font-bold cursor-pointer py-2.5"
            onClick={() => {
              const customConfig = {
                cardWidth,
                cardHeight,
                cardBorderRadius,
                cardShadow,
                cardPadding,
                elements,
              };
              localStorage.setItem("custom_product_card_builder", JSON.stringify(customConfig));
              setSelectedId(null);
              toast.success("Custom product card saved! Check Predefined Templates tab for the preview.");
            }}
          >
            <Save className="w-4 h-4 mr-1.5" /> Save Custom Product Card
          </Button>
        </div>
      </div>

      {/* 3. Right Property Inspector Panel */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Element Inspector
            </h3>
          </div>

          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {selectedElement.title}
                </span>
                <button
                  onClick={() => handleDeleteElement(selectedElement.id)}
                  className="text-red-500 hover:text-red-600 p-1 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Exact Coordinate & Size Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">X Position (px)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) =>
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedId ? { ...el, x: Math.max(0, Math.min(cardWidth - (el.width || 40), Number(e.target.value))) } : el
                        )
                      )
                    }
                    className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Y Position (px)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) =>
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedId ? { ...el, y: Math.max(0, Math.min(cardHeight - (el.height || 20), Number(e.target.value))) } : el
                        )
                      )
                    }
                    className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Width (px)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.width || 120)}
                    onChange={(e) =>
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedId ? { ...el, width: Math.max(20, Math.min(cardWidth - el.x, Number(e.target.value))) } : el
                        )
                      )
                    }
                    className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Height (px)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.height || 30)}
                    onChange={(e) =>
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedId ? { ...el, height: Math.max(15, Math.min(cardHeight - el.y, Number(e.target.value))) } : el
                        )
                      )
                    }
                    className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              {/* Movement & Nudge Pad */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Precision Movement Controls
                </h4>
                <div className="flex flex-col items-center gap-1 py-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedId ? { ...el, y: Math.max(0, el.y - 5) } : el
                        )
                      )
                    }
                    className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                    title="Move Up (5px)"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setElements((prev) =>
                          prev.map((el) =>
                            el.id === selectedId ? { ...el, x: Math.max(0, el.x - 5) } : el
                          )
                        )
                      }
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                      title="Move Left (5px)"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Nudge</span>
                    <button
                      type="button"
                      onClick={() =>
                        setElements((prev) =>
                          prev.map((el) =>
                            el.id === selectedId
                              ? { ...el, x: Math.min(310 - (el.width || 100), el.x + 5) }
                              : el
                          )
                        )
                      }
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                      title="Move Right (5px)"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setElements((prev) =>
                        prev.map((el) =>
                          el.id === selectedId
                            ? { ...el, y: Math.min(cardHeight - (el.height || 30), el.y + 5) }
                            : el
                        )
                      )
                    }
                    className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                    title="Move Down (5px)"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Center Alignment Action Buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCenterElement("x")}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                    title="Center element horizontally"
                  >
                    <AlignCenter className="w-3.5 h-3.5" /> Center X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCenterElement("y")}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                    title="Center element vertically"
                  >
                    <AlignCenter className="w-3.5 h-3.5 rotate-90" /> Center Y
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCenterElement("both")}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-secondary/10 text-secondary text-[11px] font-bold rounded-lg hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                    title="Center element completely in card"
                  >
                    Center Both
                  </button>
                </div>
              </div>

              {/* Advanced Component Style Controls: Bg, Opacity, Roundness, Padding */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Custom Component Styling
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Background Color</label>
                    <input
                      type="color"
                      value={selectedElement.props.bgColor || "#ffffff"}
                      onChange={(e) => updateSelectedProp("bgColor", e.target.value)}
                      className="mt-1 w-full h-8 p-0.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Background Opacity ({selectedElement.props.opacity ?? 100}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedElement.props.opacity ?? 100}
                      onChange={(e) => updateSelectedProp("opacity", Number(e.target.value))}
                      className="mt-2 w-full cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Border Roundness (px)</label>
                    <input
                      type="number"
                      value={selectedElement.props.borderRadius ?? 8}
                      onChange={(e) => updateSelectedProp("borderRadius", Number(e.target.value))}
                      className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Padding (px)</label>
                    <input
                      type="number"
                      value={selectedElement.props.padding ?? 0}
                      onChange={(e) => updateSelectedProp("padding", Number(e.target.value))}
                      className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Border Color</label>
                    <div className="flex gap-1.5 items-center mt-1">
                      <input
                        type="color"
                        value={selectedElement.props.borderColor || "#cbd5e1"}
                        onChange={(e) => updateSelectedProp("borderColor", e.target.value)}
                        className="w-8 h-7 p-0.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => updateSelectedProp("borderColor", undefined)}
                        className="text-[10px] px-1.5 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-800 rounded"
                        title="Clear Border Color"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500">Drop Shadow</label>
                    <select
                      value={selectedElement.props.shadow || "none"}
                      onChange={(e) => updateSelectedProp("shadow", e.target.value === "none" ? undefined : e.target.value)}
                      className="mt-1 w-full px-2 py-1 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900 text-xs"
                    >
                      <option value="none">None</option>
                      <option value="0 1px 3px rgba(0,0,0,0.1)">Subtle</option>
                      <option value="0 4px 6px rgba(0,0,0,0.12)">Medium</option>
                      <option value="0 10px 15px rgba(0,0,0,0.15)">Large</option>
                      <option value="0 0 10px rgba(59, 130, 246, 0.5)">Glow Accent</option>
                    </select>
                  </div>
                </div>
              </div>

              {selectedElement.type === "badge" && (
                <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Badge Text</label>
                  <input
                    type="text"
                    value={selectedElement.props.text || ""}
                    onChange={(e) => updateSelectedProp("text", e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  />
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Badge Variant</label>
                  <select
                    value={selectedElement.props.variant || "rect"}
                    onChange={(e) => updateSelectedProp("variant", e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="rect">Rectangle Tag</option>
                    <option value="pill">Pill Tag</option>
                    <option value="circle">Circular Tag</option>
                  </select>
                </div>
              )}

              {selectedElement.type === "title" && (
                <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Max Text Lines</label>
                  <select
                    value={selectedElement.props.lines ?? 2}
                    onChange={(e) => updateSelectedProp("lines", Number(e.target.value))}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  >
                    <option value={1}>1 Line (Truncate)</option>
                    <option value={2}>2 Lines (Standard)</option>
                    <option value={3}>3 Lines</option>
                    <option value={0}>Full Text (No Clamp)</option>
                  </select>
                </div>
              )}

              {selectedElement.type === "actions" && (
                <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Button Label</label>
                  <input
                    type="text"
                    value={selectedElement.props.primaryText || "অর্ডার করুন"}
                    onChange={(e) => updateSelectedProp("primaryText", e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  />
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Action Variant</label>
                  <select
                    value={selectedElement.props.variant || "eye-order"}
                    onChange={(e) => updateSelectedProp("variant", e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="eye-order">Eye Icon + Order Button</option>
                    <option value="single-full">Single Full Width</option>
                    <option value="double-stack">Double Action Stack</option>
                    <option value="quick-buy">Quick Buy Link</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              Click any element on the canvas to inspect its properties and adjust position or size.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RenderCustomCardPreview = ({ config }: { config: any }) => {
  if (!config || !config.elements) return null;
  const sampleProduct = {
    title: "Extonic ET-C702 Portable Air Cooler Fan – Powerful Cooling Fan (Green)",
    category: "GADGETS & ELECTRONICS",
    regularPrice: 2250,
    discountedPrice: 1750,
    imageUrl: "https://images.unsplash.com/photo-1617625802912-cde588faf581?w=600&q=80",
    stockStatus: "In Stock",
  };

  const hexToRgba = (hex?: string, alphaPercent: number = 100) => {
    if (!hex) return undefined;
    const alpha = alphaPercent / 100;
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cardWidth = config.cardWidth || 304;
  const cardHeight = config.cardHeight || 304;

  return (
    <div className="w-full flex justify-center py-2">
      <div
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
        }}
        className={`relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${config.cardBorderRadius || 'rounded-xl'} ${config.cardShadow || 'shadow-md'} ${config.cardPadding || 'p-2'}`}
      >
        {config.elements.map((el: CanvasElement) => {
          const computedBgColor = el.props.bgColor
            ? hexToRgba(el.props.bgColor, el.props.opacity ?? 100)
            : undefined;
          const computedBorderColor = el.props.borderColor || undefined;
          const computedShadow = el.props.shadow || undefined;

          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: el.width ? `${el.width}px` : undefined,
                height: el.height ? `${el.height}px` : undefined,
                zIndex: el.zIndex,
                backgroundColor: computedBgColor,
                borderColor: computedBorderColor,
                borderWidth: computedBorderColor ? "1px" : undefined,
                borderStyle: computedBorderColor ? "solid" : undefined,
                boxShadow: computedShadow,
                borderRadius: el.props.borderRadius !== undefined ? `${el.props.borderRadius}px` : undefined,
                padding: el.props.padding !== undefined ? `${el.props.padding}px` : undefined,
              }}
            >
              <div className="w-full h-full">
                {(() => {
                  switch (el.type) {
                    case "image":
                      return (
                        <div
                          style={{ width: el.width ? `${el.width}px` : "100%", height: el.height ? `${el.height}px` : "100%" }}
                          className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-xs flex items-center justify-center"
                        >
                          <img
                            src={sampleProduct.imageUrl}
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80";
                            }}
                            alt={sampleProduct.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    case "badge":
                      return <CardBadge text={el.props.text || "25% OFF"} variant={el.props.variant || "rect"} />;
                    case "wishlist":
                      return <WishlistButton />;
                    case "category":
                      return <CategoryLabel category={sampleProduct.category} align={el.props.align || "left"} />;
                    case "title":
                      return (
                        <div style={{ width: el.width ? `${el.width}px` : "100%", height: el.height ? `${el.height}px` : "100%" }}>
                          <ProductTitle title={sampleProduct.title} lines={el.props.lines ?? 0} align={el.props.align || "left"} />
                        </div>
                      );
                    case "price":
                      return <PriceDisplay regularPrice={sampleProduct.regularPrice} discountedPrice={sampleProduct.discountedPrice} align={el.props.align || "left"} />;
                    case "stock":
                      return <StockBadge status={sampleProduct.stockStatus} />;
                    case "actions":
                      return (
                        <div style={{ width: el.width ? `${el.width}px` : "100%", height: el.height ? `${el.height}px` : "100%" }}>
                          <ActionButtons variant={el.props.variant || "eye-order"} primaryText={el.props.primaryText || "অর্ডার করুন"} secondaryText="ADD TO CART" />
                        </div>
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
