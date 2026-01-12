import { useState, useRef, useEffect } from 'react';

export default function SearchableMultiSelect({ 
  label, 
  value = [], 
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
    // Garante que value seja sempre um array
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.includes(optValue)
      ? currentValue.filter(v => v !== optValue)
      : [...currentValue, optValue];
    onChange({ target: { value: newValue } });
  };

  const handleRemove = (optValue, e) => {
    e.stopPropagation();
    // Garante que value seja sempre um array
    const currentValue = Array.isArray(value) ? value : [];
    const newValue = currentValue.filter(v => v !== optValue);
    onChange({ target: { value: newValue } });
  };

  // Garante que value seja sempre um array antes de mapear
  const currentValue = Array.isArray(value) ? value : [];
  const selectedLabels = currentValue.map(v => {
    const option = options.find(opt => opt.value === v);
    return option ? option.label : v;
  });

  return (
    <div className="flex flex-col gap-1 w-full" ref={ref}>
      <label className="font-semibold">{label}</label>
      
      <div className="relative">
        <div className="w-full border-2 rounded-lg py-2 pl-2 pr-8 cursor-pointer flex flex-wrap gap-2 items-center min-h-[42px]">
          {selectedLabels.map((label, idx) => (
            <div key={idx} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center gap-2">
              <span>{label}</span>
              <button
                type="button"
                onClick={(e) => handleRemove(value[idx], e)}
                className="text-gray-600 hover:text-gray-800 font-bold"
              >
                ×
              </button>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => !disabled && setIsOpen(true)}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={disabled}
            className="flex-1 outline-none min-w-[50px] text-sm"
            autoComplete="off"
          />
        </div>

        <svg 
          className="absolute right-2 top-2 w-4 h-4 text-gray-600 pointer-events-none" 
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
              filteredOptions.map((option) => {
                const currentValue = Array.isArray(value) ? value : [];
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 ${
                      currentValue.includes(option.value)
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={currentValue.includes(option.value)}
                      onChange={() => {}}
                      className="cursor-pointer"
                    />
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
