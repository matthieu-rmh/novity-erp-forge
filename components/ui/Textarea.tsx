import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = "", rows = 3, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-bold uppercase tracking-wider text-brand-dark-gray"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={[
            "w-full rounded border px-3 py-2 text-sm text-brand-black",
            "bg-brand-white placeholder:text-brand-gray resize-none",
            "focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-1",
            error ? "border-red-500" : "border-brand-light-gray",
            className,
          ].join(" ")}
          aria-invalid={error ? "true" : undefined}
          {...props}
        />
        {hint && !error && <p className="text-xs text-brand-gray">{hint}</p>}
        {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
