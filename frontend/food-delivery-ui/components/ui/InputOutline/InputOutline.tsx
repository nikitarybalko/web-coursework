import React, { forwardRef, Ref } from "react";

export interface InputRef {
  element: HTMLInputElement | null;
  error?: string;
  focus: () => void;
}

function InputComponent(
  { className = "", ...props },
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-green-secondary outline-none ${className}`}
      {...props}
    />
  );
}

const InputOutline = forwardRef(InputComponent);

InputOutline.displayName = "InputOutline";

export default InputOutline;
