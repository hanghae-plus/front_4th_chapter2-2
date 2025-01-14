import Input from "./Input";

interface InputFieldProps {
  id?: string;
  label: string;
  type?: "text" | "number";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  ...rest
}: InputFieldProps) => (
  <div className="mb-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>

    <Input id={id} type={type} value={value} onChange={onChange} {...rest} />
  </div>
);

export default InputField;
