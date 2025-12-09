import {FavoriteIcon, FavoriteIconFilled} from '../assets/nav'
export default function JobOpening({title,company,location,work_mode}){
  return(
    <div className="flex justify-between pb-5 pt-1 border-t-2 w-[95%] relative nth-last-1:border-b-2">
      <div className="flex flex-col">
        <h3 className="text-sm text-nowrap text-balance font-bold uppercase">{title}</h3>
        <p className="text-[12px] text-clip"><span></span>{company}</p>
        <p className="text-[12px]"><span></span>{location}</p>
        <p className="text-[12px]"><span></span>{work_mode}</p>
      </div>
      <FavoriteIcon className="w-6 h-6"/>
      <button className="absolute right-0 bottom-2 text-nowrap text-sm font-bold border rounded-full border-b-2 border-r-2 px-3 py-1">Ver mais</button>
    </div>
  )
}