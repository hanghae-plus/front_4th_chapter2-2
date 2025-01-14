interface InputFieldProps {
  id: string;
  label: string;
  value: string | number;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, value, type, onChange }) => (
  <div className='mb-2'>
    <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className='w-full p-2 border rounded'
    />
  </div>
);
