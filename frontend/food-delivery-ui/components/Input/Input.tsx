import React, {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}
function InputComponent(
  { label, error, icon, className = "", ...props }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-placeholder flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          className={`w-full py-2 border border-transparent placeholder:text-sm rounded-lg bg-gray-bg outline-none transition-colors 
              focus:ring-2 focus:ring-brand-green-primary 
              ${icon ? "pl-10 pr-3" : "px-3"}
              ${error ? "ring-2 ring-red-500" : ""}
              ${className}`}
          {...props}
        />
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

const Input = forwardRef(InputComponent);

Input.displayName = "Input";

export default Input;
