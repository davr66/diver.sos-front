export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  fullWidth = true,
  type = 'button'
}) {
  const baseClasses = 'font-semibold py-3.5 px-4 rounded-lg transition shadow-sm';
  const variantClasses = {
    primary: 'bg-violet-500 hover:bg-violet-600 disabled:bg-violet-300 text-white',
    link: 'text-violet-600 hover:text-violet-700 shadow-none p-0'
  };
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}