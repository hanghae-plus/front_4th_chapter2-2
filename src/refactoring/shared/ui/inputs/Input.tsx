interface InputProps {
  id?: string;
  type: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ id, type, value, onChange }: InputProps): JSX.Element {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
    />
  );
}
