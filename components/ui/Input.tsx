import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 transition-all duration-150",
            "placeholder:text-slate-400",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-300 focus-visible:ring-red-400 bg-red-50/30"
              : "border-slate-200 focus-visible:ring-emerald-400 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
