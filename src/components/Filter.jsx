import { useState, useRef, useEffect } from 'react';

export default function Filter({ value = [], onChange, options: propOptions, label = 'Modalidade', closeOnSelect = false, multiSelect = true, useDefaultOptions = true }){
  const defaultOptions = [
    { value: 'Remoto', label: 'Remoto' },
    { value: 'Híbrido', label: 'Híbrido' },
    { value: 'Presencial', label: 'Presencial' },
  ];

  const options = Array.isArray(propOptions) && propOptions.length > 0
    ? propOptions
    : (useDefaultOptions ? defaultOptions : []);

  const normalizeStr = (str) => (str || '').normalize('NFD').replace(/[^\w\s-]|[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

  const allNormalized = options.map(o => normalizeStr(o.value));

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optValue) => {
    const norm = normalizeStr(optValue);
    const exists = value.includes(norm);
    const next = exists ? value.filter(v => v !== norm) : [...value, norm];
    onChange && onChange(next);
    if (closeOnSelect) setOpen(false);
  };

  const toggleAll = () => {
    if (value.length === allNormalized.length) {
      onChange && onChange([]);
    } else {
      onChange && onChange(allNormalized);
    }
    if (closeOnSelect) setOpen(false);
  };

  const clearAll = () => { onChange && onChange([]); if (closeOnSelect) setOpen(false); };

  const displayLabel = (normVal) => {
    const opt = options.find(o => normalizeStr(o.value) === normVal);
    return opt ? opt.label : normVal;
  };

  const hasSelection = value.length > 0;
  const buttonClass = hasSelection
    ? 'flex items-center gap-2 border-2 rounded-full px-3 py-1 bg-black text-white hover:ring-1 hover:ring-gray-600 hover:cursor-pointer'
    : 'flex items-center gap-2  border-2 rounded-full px-3 py-1 bg-white hover:ring-1 hover:ring-gray-300 hover:cursor-pointer';
  const btnLabel = label;

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className={buttonClass}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex-1">
          <span>{btnLabel}</span>
        </div>
        <svg className={`w-4 h-4 ${hasSelection ? 'text-white' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-[220px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2 max-h-44 overflow-auto">
            {options.length > 0 && multiSelect && (
              <div className="flex items-center justify-between mb-2">
                <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">Limpar</button>
                <span className="text-xs text-gray-500">Selecionados: {value.length}</span>
              </div>
            )}

            {options.length > 0 && multiSelect && (
              <label key="all" className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.length === allNormalized.length}
                  onChange={toggleAll}
                  className="w-4 h-4"
                />
                <span className="text-sm">Todos</span>
              </label>
            )}

            {options.length === 0 ? (
              <div className="px-2 py-3 text-sm text-gray-500 text-center">
                Nenhuma opção disponível
              </div>
            ) : (
              options.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type={multiSelect ? "checkbox" : "radio"}
                    name={multiSelect ? undefined : "filter-option"}
                    checked={value.includes(normalizeStr(opt.value))}
                    onChange={() => multiSelect ? toggleOption(opt.value) : (onChange([normalizeStr(opt.value)]), closeOnSelect && setOpen(false))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
