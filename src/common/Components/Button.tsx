import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon" | "none";
  roundedFull?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: "button" | "label";
  htmlFor?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;
}

/**
 * Common Button component following the design system.
 * Polymorphic: Supports rendering as a standard button or a label (e.g. for file uploads).
 * Includes interactive tap animations and support for rounded-full variants.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  roundedFull = false,
  className,
  children,
  as = "button",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const roundingStyle = roundedFull ? "rounded-full" : "rounded-lg!";

  const variants = {
    primary: "bg-brand-primary text-primary-bg hover:bg-transparent hover:text-brand-primary border border-brand-primary shadow-sm",
    secondary: "bg-bg-brand-primary text-brand-primary hover:bg-brand-primary hover:text-primary-bg border border-transparent",
    outline: "border border-brand-primary text-brand-primary hover:bg-bg-brand-primary",
    ghost: "text-brand-primary hover:bg-bg-brand-primary",
  };

  const sizes = {
    sm: roundedFull ? "p-2 text-sm" : "px-4 py-2 text-sm",
    md: roundedFull ? "p-3 text-sm md:text-base" : "px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base",
    lg: roundedFull ? "p-4 text-base md:text-lg" : "px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg",
    icon: "p-2 text-sm",
    none: "",
  };

  const Component = as === "label" ? motion.label : motion.button;

  return (
    <Component
      whileTap={{ scale: 0.96 }}
      className={cn(baseStyles, roundingStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
};
