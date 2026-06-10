"use client";

import { InputHTMLAttributes } from "react";
import { SearchIcon } from "@/components/ui/icons";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange: (value: string) => void;
}

function SearchInput({ onChange, className = "", ...props }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-xs">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" size={15} />
      <input
        type="text"
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full rounded border border-brand-light-gray bg-brand-white",
          "pl-9 pr-3 py-2 text-sm text-brand-black placeholder:text-brand-gray",
          "focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-1",
          className,
        ].join(" ")}
        {...props}
      />
    </div>
  );
}

export { SearchInput };
export type { SearchInputProps };
