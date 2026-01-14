import { MdSearch } from "react-icons/md";

export default function SearchBar({
  value = "",
  onChange = () => {},
  onSubmit,
  placeholder = "Pesquisar...",
  className = ""
}){
  return (
    <form
      data-testid="search-form"
      onSubmit={(e)=>{ e.preventDefault(); if (typeof onSubmit === 'function') onSubmit(); }}
      className="flex justify-center items-center w-full gap-1 relative max-w-150"
    >
      <input
        data-testid="search-input"
        type="text"
        name="search"
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
        className={`border-2 p-2 px-15 rounded-full pl-3 w-full ${className}`}
      />

      <button
        data-testid="search-submit"
        type="submit"
        className="absolute right-0 flex items-center justify-center
          p-1 z-1
          border-2
          rounded-full"
      >
        <MdSearch size={30}></MdSearch>
      </button>
    </form>
  );
}