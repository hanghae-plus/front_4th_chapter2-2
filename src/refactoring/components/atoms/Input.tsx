interface InputProps {
  id?: string;
  type?: 'text' | 'number';
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

const Input = ({ id, type = 'text', placeholder, value, onChange, className = '' }: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => {
        const newValue = type === 'number' ? parseInt(e.target.value) : e.target.value;
        onChange(newValue);
      }}
      className={`w-full p-2 border rounded ${className}`}
    />
  );
};

export default Input;
