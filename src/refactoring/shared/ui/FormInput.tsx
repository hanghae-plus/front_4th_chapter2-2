interface FormInputProps {
  id?: string;
  label: string | null;
  value: string | number;
  type?: 'text' | 'number';
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  error?: string | null;
  className?: string;
}

export function FormInput({
  id = '',
  label,
  value,
  onChange,
  placeholder = '',
  min = 0,
  max = 1e9,
  error = null,
  type = 'number',
  className = '',
}: FormInputProps) {
  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="block mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
  );
}
