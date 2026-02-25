import { useState, useRef, useEffect } from 'react';
import LocationSelect from './LocationSelect';

export default function CascadingFilter({ onStateChange, onCityChange, buttonColor, initialState = [], initialCities = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCities, setSelectedCities] = useState(initialCities);
  const [appliedState, setAppliedState] = useState(initialState);
  const [appliedCities, setAppliedCities] = useState(initialCities);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const normalizeStr = (str) => 
    (str || '')
      .normalize('NFD')
      .replace(/[^\w\s-]|[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const data = await response.json();
        const states = data
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .map(state => ({
            value: state.sigla,
            label: `${state.nome} - ${state.sigla}`
          }));
        setStateOptions(states);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState.length === 0) {
        setCityOptions([]);
        return;
      }
      try {
        setLoadingCities(true);
        const uf = selectedState[0];
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const data = await response.json();
        const cities = data
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .map(city => ({
            value: city.nome,
            label: city.nome
          }));
        setCityOptions(cities);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedState]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const padding = 16; // to keep modal off viewport edges
      const isMobile = window.innerWidth < 768;
      const dropdownWidth = isMobile ? (window.innerWidth - padding * 2) : 384; // md:w-96 ≈ 384px
      const clampedLeft = Math.min(
        Math.max(rect.left, padding),
        Math.max(padding, window.innerWidth - dropdownWidth - padding)
      );
      setDropdownPosition({
        top: rect.bottom + 8,
        left: clampedLeft
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleStateChange = (newState) => {
    const singleState = newState.slice(-1); // Keep only the last selected
    setSelectedState(singleState);
    setSelectedCities([]);
    setCityOptions([]);
  };

  const handleCityChange = (newCities) => {
    setSelectedCities(newCities);
  };

  const handleApplyFilters = () => {
    setAppliedState(selectedState);
    setAppliedCities(selectedCities);
    onStateChange && onStateChange(selectedState);
    onCityChange && onCityChange(selectedCities);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedState([]);
    setSelectedCities([]);
  };

  const handleClearApplied = (e) => {
    if (e) e.stopPropagation();
    setSelectedState([]);
    setSelectedCities([]);
    setAppliedState([]);
    setAppliedCities([]);
    onStateChange && onStateChange([]);
    onCityChange && onCityChange([]);
    setIsOpen(false);
  };

  const getSelectedStateLabel = () => {
    if (selectedState.length === 0) return 'Estado';
    const found = stateOptions.find(s => normalizeStr(s.value) === normalizeStr(selectedState[0]));
    return found ? found.label : 'Estado';
  };

  const getSelectedCitiesLabel = () => {
    if (selectedCities.length === 0) return 'Cidades';
    if (selectedCities.length === 1) {
      const found = cityOptions.find(c => normalizeStr(c.value) === normalizeStr(selectedCities[0]));
      return found ? found.label : selectedCities[0];
    }
    return `${selectedCities.length} cidades selecionadas`;
  };

  const btnLabel = (appliedState.length > 0 || appliedCities.length > 0)
    ? `Local (${appliedCities.length})`
    : 'Local';

  const hasSelection = appliedState.length > 0 || appliedCities.length > 0;
  const buttonClass = hasSelection
    ? 'flex items-center gap-2 border-2 rounded-full px-3 py-1 bg-black text-medium text-white hover:ring-1 hover:ring-gray-600 hover:cursor-pointer'
    : 'flex items-center gap-2 border-2 border-black rounded-full px-3 py-1 bg-white hover:ring-1 hover:ring-gray-300 hover:cursor-pointer';

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(s => !s)}
        className={buttonClass}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex-1">
          <span>{btnLabel}</span>
        </div>
        {hasSelection ? (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClearApplied}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClearApplied(e); }}
            className="ml-1 flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/20 text-white text-xs font-bold"
            title="Limpar filtro de local"
          >
            ✕
          </span>
        ) : (
          <svg className="w-4 h-4 text-black" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed z-10 w-[calc(100vw-2rem)] md:w-96 h-110 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 flex flex-col md:mt-1 border-1"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            maxWidth: 'calc(100vw - 2rem)'
          }}
        >
          <div id='modal' className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-semibold mb-3">Filtrar por Local</h3>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-2">Estado</label>
              {loadingStates ? (
                <div className="text-sm text-gray-500">Carregando estados...</div>
              ) : (
                <LocationSelect
                  value={selectedState}
                  onChange={handleStateChange}
                  options={stateOptions}
                  label={getSelectedStateLabel()}
                  multiSelect={false}
                  placeholder="Pesquisar estado..."
                />
              )}
            </div>

            {selectedState.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2">Cidades</label>
                {loadingCities ? (
                  <div className="text-sm text-gray-500">Carregando cidades...</div>
                ) : (
                  <LocationSelect
                    value={selectedCities}
                    onChange={handleCityChange}
                    options={cityOptions}
                    label={getSelectedCitiesLabel()}
                    multiSelect={true}
                    placeholder="Pesquisar cidade..."
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end border-t p-4 bg-white">
            <button
              type="button"
              onClick={handleClearApplied}
              className="px-3 py-1.5 border-2 rounded-md text-xs font-medium hover:bg-gray-50 hover:cursor-pointer"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              style={{ 
                backgroundColor: buttonColor,
              }}
              className="border-2 border-b-3 border-r-3 px-3 py-1.5 rounded-md text-xs font-medium text-black hover:brightness-90 hover:cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
