export default function SearchBar({value,onChange,placeholder = "Pesquisar...",className=""}){
  return (
    <input type="text"
    name={value}
    onChange={(e)=>onChange(e.target.value)}
    placeholder={placeholder}
    className={`border border-b-5 border-r-5 p-2 rounded-full pl-3 w-[80%] mb-5 ${className}`} />
  );
}