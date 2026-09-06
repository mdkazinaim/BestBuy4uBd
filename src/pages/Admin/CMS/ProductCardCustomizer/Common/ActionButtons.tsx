import { Eye } from "lucide-react";

interface ActionButtonsProps {
  variant?: "eye-order" | "single-full" | "quick-buy" | "double-stack";
  primaryText?: string;
  secondaryText?: string;
  onClickPrimary?: () => void;
  onClickSecondary?: () => void;
  colorScheme?: string;
  className?: string;
}

export const ActionButtons = ({
  variant = "single-full",
  primaryText = "অর্ডার করুন",
  secondaryText = "ADD TO CART",
  onClickPrimary,
  onClickSecondary,
  className = "",
}: ActionButtonsProps) => {
  const primaryBtnClass = "bg-secondary text-white hover:opacity-90 transition-opacity";

  if (variant === "eye-order") {
    return (
      <div className={`flex gap-2 w-full ${className}`}>
        <button
          onClick={onClickSecondary}
          className="w-9 h-9 bg-slate-900 dark:bg-slate-800 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={onClickPrimary}
          className={`flex-1 rounded-lg font-bold text-xs cursor-pointer py-2 shadow-xs ${primaryBtnClass}`}
        >
          {primaryText}
        </button>
      </div>
    );
  }

  if (variant === "quick-buy") {
    return (
      <button
        onClick={onClickPrimary}
        className={`text-xs font-bold underline text-secondary hover:opacity-80 transition-opacity cursor-pointer ${className}`}
      >
        {primaryText}
      </button>
    );
  }

  if (variant === "double-stack") {
    return (
      <div className={`grid grid-cols-2 gap-2 w-full ${className}`}>
        <button
          onClick={onClickSecondary}
          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
        >
          {secondaryText}
        </button>
        <button
          onClick={onClickPrimary}
          className={`text-xs font-bold py-2 rounded-lg cursor-pointer shadow-xs ${primaryBtnClass}`}
        >
          {primaryText}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onClickPrimary}
      className={`w-full text-xs font-bold py-2.5 rounded-lg cursor-pointer shadow-xs ${primaryBtnClass} ${className}`}
    >
      {primaryText}
    </button>
  );
};
