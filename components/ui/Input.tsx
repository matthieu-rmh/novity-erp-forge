import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/*
  Wraps <input> with an optional label + error message.
  The label is linked via htmlFor/id so clicking the label focuses the input
  (accessibility requirement, also tested by Lighthouse).

  error prop renders in red below the input — consumed by react-hook-form
  or Server Action validation results.
*/
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-brand-dark-gray"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded border px-3 py-2 text-sm text-brand-black",
            "bg-brand-white placeholder:text-brand-gray",
            "focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-1",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-brand-light-gray",
            "disabled:bg-brand-offwhite disabled:cursor-not-allowed disabled:text-brand-gray",
            className,
          ].join(" ")}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-brand-gray">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
