"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]",
          "rounded-xl",
          {
            "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500 shadow-sm":
              variant === "primary",
            "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300 shadow-sm":
              variant === "secondary",
            "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300":
              variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-sm":
              variant === "danger",
          },
          {
            "px-3 py-1.5 text-xs gap-1.5 h-8": size === "sm",
            "px-4 py-2 text-sm gap-2 h-9": size === "md",
            "px-5 py-3 text-sm gap-2 h-11": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
