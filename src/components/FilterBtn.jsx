export default function FilterBtn({label,active,onClick}){
  return(
    <button onClick={onClick} className={`${active ? 'bg-black text-white py-4':'bg-white text-black'} flex items-center justify-center py-[.2rem] px-3 border-2 rounded-full uppercase text-sm font-semibold`}>{label}</button>
  );
}