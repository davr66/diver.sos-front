export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  onKeyPress,
  rightIcon,
  name,
  required,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none h-[42px]"
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onKeyPress={onKeyPress}
          required={required}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 ">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}
