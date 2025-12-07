export default function InputField({ 

  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  disabled = false,
  onKeyPress,
  rightIcon
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        )}
        <input
          type={type}
          value={value}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${rightIcon ? 'pr-12' : 'pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition bg-gray-50`}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onKeyPress={onKeyPress}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}


