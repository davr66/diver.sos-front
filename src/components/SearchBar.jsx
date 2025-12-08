import { MdSearch } from "react-icons/md";

export default function SearchBar({value,onChange,placeholder = "Pesquisar...",className=""}){
  return (
    <div className="flex justify-center items-center w-[90%] mb-5 gap-1">
      <input type="text"
      name={value}
      onChange={(e)=>onChange(e.target.value)}
      placeholder={placeholder}
      className={`border border-b-5 border-r-5 p-2 rounded-full pl-3 w-[80%] ${className}`} />

      <button type="submit" className="flex items-center justify-center
          p-1
          border border-b-4 border-r-4
          rounded-full"><MdSearch size={30}></MdSearch></button>
    </div>
  );
}