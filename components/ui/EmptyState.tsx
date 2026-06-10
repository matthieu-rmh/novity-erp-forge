import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}

function EmptyState({ icon, title, hint, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-brand-offwhite border border-brand-light-gray flex items-center justify-center text-brand-gray mb-4">
          {icon}
        </div>
      )}
      <p className="text-sm font-bold text-brand-black">{title}</p>
      {hint && <p className="text-sm text-brand-gray mt-1 max-w-xs">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
