import { useState } from "react";
import EyeIcon from "../assets/eye.svg";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      <div className="relative">
        <input
          type={effectiveType}
          name={name}
          value={value}
          className="w-full pl-3 pr-10 py-2 border-2 rounded-lg focus:outline-none h-[42px]"
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onKeyPress={onKeyPress}
          required={required}
        />
        {isPassword ? (
          <button
            type="button"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full cursor-pointer transition flex items-center justify-center
            ${showPassword ? "bg-gray-300" : "bg-transparent"}`}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
            disabled={disabled}
          >
            <img src={EyeIcon} alt="Ícone de olho" className={`w-6 h-6 ${showPassword ? "opacity-100" : "opacity-80"}`} />
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 ">
            {rightIcon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
