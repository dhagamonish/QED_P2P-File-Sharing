"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
}

export const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {

    const variants = {
      primary: "bg-neo-yellow text-neo-black border-neo-black hover:bg-white hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-0 active:shadow-neo-sm",
      secondary: "bg-neo-blue text-neo-black border-neo-black hover:bg-white hover:-translate-y-1 hover:shadow-neo-lg",
      outline: "bg-transparent text-neo-black border-neo-black hover:bg-neo-yellow hover:-translate-y-1 hover:shadow-neo-lg",
      ghost: "bg-transparent border-transparent hover:bg-transparrent hover:underline decoration-4 underline-offset-4",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm border-2 shadow-neo-sm",
      md: "px-6 py-3 text-base border-2 shadow-neo",
      lg: "px-8 py-4 text-xl border-4 shadow-neo",
      xl: "px-10 py-6 text-2xl font-black border-4 shadow-neo-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative font-bold uppercase transition-all duration-200 ease-in-out active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeoButton.displayName = "NeoButton";
