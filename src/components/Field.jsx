import { useState } from "react";
import EyeIcon from "../assets/eye.svg";

export default function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  id,
  name,
  onFocus,
  onBlur,
  placeholder,
  required = true,
  requiredStyle,
  maxLength
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="font-semibold">{label}
        {requiredStyle ? <span className="text-red-500">*</span> : ""}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name || id}
          className="border-2 rounded-lg py-2 pl-2 pr-10 w-full"
          type={effectiveType}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
        />
        {isPassword && (
          <button
            type="button"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full cursor-pointer transition flex items-center justify-center
            ${showPassword ? "bg-gray-300" : "bg-transparent"}`}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
          >
            <img src={EyeIcon} alt="Ícone de olho" className={`w-6 h-6 ${showPassword ? "opacity-100" : "opacity-80"}`} />
          </button>
        )}
      </div>

      {error && <span className="text-xs text-red-500"><i>{error}</i></span>}
    </div>
  );
}