interface InputFieldProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string | number;
  type: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  type,
  onChange,
  className,
}) => (
  <>
    {label && (
      <label htmlFor={id} className='block mb-1'>
        {label}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full p-2 border rounded ${className ?? ''}`}
    />
  </>
);
