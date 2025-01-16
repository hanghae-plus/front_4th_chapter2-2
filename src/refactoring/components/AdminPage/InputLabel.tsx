import { ChangeEvent, ReactNode } from "react";

interface InputLabelProps<T extends number | string> {
  id: string;
  valueType: string;
  value: T;
  label: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputLabel = <T extends number | string>({
  id,
  valueType,
  label,
  onChange,
  value
}: InputLabelProps<T>) => {
  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        type={valueType}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}