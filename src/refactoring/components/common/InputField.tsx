import Input from "./Input";

interface InputFieldProps {
  id?: string;
  label: string;
  type?: "text" | "number";
}

const InputField = ({ id, label, type = "text", ...rest }: InputFieldProps) => (
  <div className="mb-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>

    <Input id={id} type={type} {...rest} />
  </div>
);

export default InputField;
