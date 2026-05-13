"use client";
import { forwardRef, InputHTMLAttributes, Ref, useState } from "react";
import { Phone } from "lucide-react";
import Input from "@/components/ui/Input/Input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

function PhoneInputComponent(
  { error, ...props }: InputProps,
  ref: Ref<HTMLInputElement>,
) {
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");

    let formatted = "+";
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length >= 4) formatted += " (" + digits.substring(3, 5);
    if (digits.length >= 6) formatted += ") " + digits.substring(5, 8);
    if (digits.length >= 9) formatted += "-" + digits.substring(8, 10);
    if (digits.length >= 11) formatted += "-" + digits.substring(10, 12);

    setPhone(formatted === "+" ? "" : formatted);
  };

  return (
    <Input
      error={error}
      ref={ref}
      icon={<Phone size={18} className="text-placeholder" />}
      type="tel"
      placeholder="+380 (XX) XXX-XX-XX"
      value={phone}
      onChange={handlePhoneChange}
      maxLength={19}
      {...props}
    />
  );
}

const PhoneInput = forwardRef(PhoneInputComponent);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
