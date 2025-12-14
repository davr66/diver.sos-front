export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = true,
  type = "button",
}) {
  const baseClasses = "font-semibold rounded-lg transition shadow-sm";
  const variantClasses = {
    primary:
      "w-full bg-[#7FD957] hover:bg-[#6FC847] text-black font-bold py-3 rounded-xl border-4 border-black transition-colors",
    link: "text-violet-600 hover:text-violet-700 shadow-none p-0",
  };
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}
