export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  onKeyPress,
  rightIcon,
}) {
  return (
    <div>
      <label className="block text-2x1 font-semibold mb-2">{label}</label>
      <div className="">
        <input
          type={type}
          value={value}
          className={
            "w-full px-4 py-3 border-4  border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black "
          }
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onKeyPress={onKeyPress}
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
