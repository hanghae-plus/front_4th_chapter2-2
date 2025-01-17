import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e) => void;
  label: string;
}

function Input({ onChange, label, ...otherInputProps }: InputProps) {
  return (
    <div className="mb-2">
      <label htmlFor={otherInputProps.id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input {...otherInputProps} onChange={onChange} className="w-full p-2 border rounded" />
    </div>
  );
}
export { Input };
