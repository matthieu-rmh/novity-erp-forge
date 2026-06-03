import { ButtonHTMLAttributes, forwardRef } from "react";

/*
  Why forwardRef? So parent components can attach a ref to the underlying
  <button> element — useful for focus management and form libraries.

  Why variant + size instead of raw className? It enforces the design
  system: callers pick from defined options instead of writing one-off
  Tailwind strings that diverge from the brand.
*/

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-black text-brand-white hover:bg-brand-dark-gray active:bg-brand-black",
  secondary:
    "bg-brand-offwhite text-brand-black border border-brand-light-gray hover:bg-brand-light-gray",
  ghost:
    "bg-transparent text-brand-dark-gray hover:bg-brand-light-gray",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          "inline-flex items-center justify-center gap-2",
          "rounded font-bold transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
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

// Inline spinner to avoid a circular import with the Spinner component file
function Spinner({ size }: { size: "sm" }) {
  return (
    <svg
      className={`animate-spin ${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

export { Button };
export type { ButtonProps, Variant, Size };
