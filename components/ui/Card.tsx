import { HTMLAttributes } from "react";

/*
  Card is the primary container for forms, KPI blocks, and content panels.
  Using bg-brand-white (not offwhite) to lift the card off the offwhite page bg.
  No shadow by default — shadows are reserved for modals per design rules.
*/

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: "lavender" | "mint" | "peach" | null;
}

function Card({ accent = null, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "bg-brand-white border border-brand-light-gray rounded p-5",
        accent ? `border-l-4 border-l-brand-${accent}` : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps };
