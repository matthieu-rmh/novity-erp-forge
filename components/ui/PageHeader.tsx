import { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { BadgeColor } from "@/components/ui/Badge";
import { ArrowLeftIcon } from "@/components/ui/icons";

interface PageHeaderProps {
  badge?: string;
  badgeColor?: BadgeColor;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backHref?: string;
}

function PageHeader({ badge, badgeColor, title, subtitle, actions, backHref }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-7">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gray hover:text-brand-black mb-3 transition-colors"
          >
            <ArrowLeftIcon size={14} /> Retour
          </Link>
        )}
        <div className="flex items-center gap-3">
          {badge && <Badge color={badgeColor}>{badge}</Badge>}
          <h1 className="text-2xl font-black text-brand-black leading-tight tracking-tight">
            {title}
          </h1>
        </div>
        {subtitle && <p className="text-sm text-brand-gray mt-1.5">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">{actions}</div>
      )}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
