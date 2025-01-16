interface InputProps {
  id?: string;
  type: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function Input({
  id,
  type,
  value,
  onChange,
  placeholder,
}: InputProps): JSX.Element {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded"
    />
  );
}
