import { useState } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  isWishlisted?: boolean;
  onToggle?: (active: boolean) => void;
  activeColor?: "red" | "pink" | "blue" | "purple";
  className?: string;
}

export const WishlistButton = ({
  isWishlisted: externalState,
  onToggle,
  activeColor = "red",
  className = "",
}: WishlistButtonProps) => {
  const [internalState, setInternalState] = useState(false);
  const active = externalState !== undefined ? externalState : internalState;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !active;
    if (externalState === undefined) setInternalState(newState);
    onToggle?.(newState);
  };

  const activeColorMap = {
    red: "bg-red-500 text-white",
    pink: "bg-pink-500 text-white",
    blue: "bg-blue-600 text-white",
    purple: "bg-purple-600 text-white",
  };

  const activeBgClass = activeColorMap[activeColor];

  return (
    <button
      onClick={handleToggle}
      className={`w-8 h-8 rounded-full backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer ${
        active
          ? activeBgClass
          : "bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-red-500"
      } ${className}`}
    >
      <Heart className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
    </button>
  );
};
