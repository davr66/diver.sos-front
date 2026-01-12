import { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  disabled = false,
  placeholder = 'Selecione'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  const normalizeStr = (str) => 
    (str || '')
      .normalize('NFD')
      .replace(/[^\w\s-]|[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    normalizeStr(opt.label).includes(normalizeStr(searchTerm))
  );

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue } });
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayValue = () => {
    if (!value) return '';
    // Se value for um objeto, pega o value dele
    const val = typeof value === 'object' && value !== null ? value.value : value;
    const option = options.find(opt => opt.value === val);
    return option ? option.label : val;
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={ref}>
      <label className="font-semibold">{label}</label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : displayValue()}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-2 rounded-lg py-2 pl-2 pr-8 cursor-pointer"
          autoComplete="off"
        />
        <svg 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {isOpen && !disabled && (
          <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Nenhum resultado encontrado
              </div>
            ) : (
              filteredOptions.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
