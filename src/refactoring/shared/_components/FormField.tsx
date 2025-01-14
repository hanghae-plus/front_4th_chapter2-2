export type FormFieldProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number";
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export const FormField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  className = "mb-2",
  labelClassName = "block text-sm font-medium text-gray-700",
  inputClassName = "w-full p-2 border rounded",
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
      />
    </div>
  );
};
