import React from "react";

interface InputProps {
  label?: string;
  labelType?: string;
  id?: string;
  type?: "text" | "number";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: "full" | "small";
  placeholder?: string;
}

const labelClassName: Record<string, string> = {
  newItem: "block text-sm font-medium text-gray-700",
  editItem: "block mb-1",
};

const inputSize: Record<string, string> = {
  full: "full",
  small: "1/3",
};

const Input = ({
  label,
  labelType,
  id,
  type = "number",
  value,
  onChange,
  className,
  size = "full",
  placeholder,
}: InputProps) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className={labelClassName[`${labelType}`]}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className || `w-${inputSize[`${size}`]} p-2 border rounded}`}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
