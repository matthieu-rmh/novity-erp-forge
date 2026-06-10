"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, className = "", children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold uppercase tracking-wider text-brand-dark-gray"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              "w-full appearance-none rounded border px-3 py-2 pr-9 text-sm text-brand-black",
              "bg-brand-white cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-1",
              error ? "border-red-500" : "border-brand-light-gray",
              "disabled:bg-brand-offwhite disabled:cursor-not-allowed",
              className,
            ].join(" ")}
            aria-invalid={error ? "true" : undefined}
            {...props}
          >
            {children}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" size={14} />
        </div>
        {hint && !error && <p className="text-xs text-brand-gray">{hint}</p>}
        {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
export type { SelectProps };
