import { HTMLAttributes } from "react";

/*
  Badge/pill component used for module labels and status indicators.
  The `color` prop maps to our module color scheme from CLAUDE.md:
    lavender → CRM, Orders
    mint     → Stock, Invoices
    peach    → Auth, Setup
*/

type BadgeColor = "lavender" | "mint" | "peach" | "gray" | "black";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  lavender: "bg-brand-lavender text-brand-black",
  mint:     "bg-brand-mint text-brand-black",
  peach:    "bg-brand-peach text-brand-black",
  gray:     "bg-brand-light-gray text-brand-dark-gray",
  black:    "bg-brand-black text-brand-white",
};

function Badge({
  color = "gray",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-block rounded-full px-2 py-0.5",
        "text-xs font-bold uppercase tracking-wider",
        colorClasses[color],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeColor };
