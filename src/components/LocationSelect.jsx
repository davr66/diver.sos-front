import { useState, useRef, useEffect } from 'react';

export default function LocationSelect({ 
  value = [], 
  onChange, 
  options = [], 
  label = 'Selecione', 
  multiSelect = false,
  placeholder = 'Pesquisar...'
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);
  const searchInputRef = useRef(null);

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
        setOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filteredOptions = options.filter(opt => 
    normalizeStr(opt.label).includes(normalizeStr(searchTerm))
  );

  const toggleOption = (optValue) => {
    const norm = normalizeStr(optValue);
    if (multiSelect) {
      const exists = value.includes(norm);
      const next = exists ? value.filter(v => v !== norm) : [...value, norm];
      onChange && onChange(next);
    } else {
      onChange && onChange([norm]);
      setOpen(false);
      setSearchTerm('');
    }
  };

  const removeOption = (normVal) => {
    const next = value.filter(v => v !== normVal);
    onChange && onChange(next);
  };

  const displayLabel = (normVal) => {
    const opt = options.find(o => normalizeStr(o.value) === normVal);
    return opt ? opt.label : normVal;
  };

  const hasSelection = value.length > 0;
  const buttonClass = hasSelection
    ? 'flex items-center gap-2 border-2 rounded-full px-3 py-1 bg-black text-white hover:ring-1 hover:ring-gray-600 hover:cursor-pointer'
    : 'flex items-center gap-2 border-2 rounded-full px-3 py-1 bg-white text-gray-700 hover:ring-1 hover:ring-gray-300 hover:cursor-pointer';

  return (
    <div className="relative inline-block text-left w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className={buttonClass}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex-1">
          <span>{label}</span>
        </div>
        <svg className={`w-4 h-4 ${hasSelection ? 'text-white' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2">
            {/* Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

            {/* Selected Cities as Mini Cards (only for multiSelect) */}
            {multiSelect && value.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded max-h-24 overflow-auto">
                {value.map(normVal => (
                  <div
                    key={normVal}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    <span>{displayLabel(normVal)}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(normVal);
                      }}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  Nenhum resultado encontrado
                </div>
              ) : (
                filteredOptions.map(opt => (
                  <label 
                    key={opt.value} 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type={multiSelect ? "checkbox" : "radio"}
                      name={multiSelect ? undefined : "location-select"}
                      checked={value.includes(normalizeStr(opt.value))}
                      onChange={() => toggleOption(opt.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
