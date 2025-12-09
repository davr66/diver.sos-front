import { FavoriteIcon } from "../assets/nav"
export default function Group({title,category,description}){
  return(
    <div className="flex justify-between py-2 relative w-[90%] border-t-2 nth-last-1:border-b-2">
      <div className="flex flex-col">
        <h3 className="text-sm text-nowrap text-balance font-bold uppercase">{title}</h3>
        <span className="text-[0.75rem] font-semibold text-gray-700">{category}</span>
        <p className="text-[0.65rem] text-wrap w-[75%]">{description}</p>
      </div>
      <div>
        <FavoriteIcon className="w-6 h-6"/>
      </div>
      <button className="absolute right-0 bottom-2 text-nowrap text-sm font-bold border rounded-full border-b-2 border-r-2 px-3 py-1">Ver mais</button>
    </div>
  )
}