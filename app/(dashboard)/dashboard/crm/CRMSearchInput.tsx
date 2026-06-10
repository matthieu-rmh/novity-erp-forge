"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { SearchInput } from "@/components/ui/SearchInput";

interface CRMSearchInputProps {
  defaultValue: string;
}

export function CRMSearchInput({ defaultValue }: CRMSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  // Keep in sync if URL changes externally (browser back/forward)
  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  function handleChange(val: string) {
    setValue(val);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("search", val);
      } else {
        params.delete("search");
      }
      params.set("page", "0");
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <SearchInput
      value={value}
      onChange={handleChange}
      placeholder="Rechercher un contact…"
      className="w-64"
    />
  );
}
