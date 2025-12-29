export default function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  onFocus,
  onBlur,
  placeholder,
  required=true,
  requiredStyle
}){
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-semibold">{label} 
        {requiredStyle ? <span className="text-red-500">*</span> : "" }
      </label>

      <input
        className="border-2 rounded-lg py-2 pl-2"
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
      />

      {error && <span className="text-xs text-red-500"><i>{error}</i></span>}
    </div>
  );
}