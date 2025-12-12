import { FavoriteIcon, FavoriteIconFilled } from '../assets/nav'
export default function JobOpening({data, type }) {
  console.log(data)
  return (
    <div className="flex justify-between pb-5 pt-1 border-t-2 w-[95%] relative nth-last-1:border-b-2">
      {type == 'job_opening' ? (
        <div className="flex flex-col">
          <h3 className="text-sm text-nowrap text-balance font-bold uppercase">{data.title}</h3>
          <p className="text-[12px] text-clip"><span></span>{data.company}</p>
          <p className="text-[12px]"><span></span>{data.location}</p>
          <p className="text-[12px]"><span></span>{data.work_mode}</p>
        </div>)
        : (
          <div className="flex flex-col">
            <h3 className="text-sm text-nowrap text-balance font-bold uppercase">{data.title}</h3>
            <span className="text-[0.75rem] font-semibold text-gray-700">{data.category}</span>
            <p className="text-[0.65rem] text-wrap w-[75%]">{data.description}</p>
          </div>)
      }


      <FavoriteIcon className="w-6 h-6" />
      <button className="absolute right-0 bottom-2 text-nowrap text-sm font-bold border rounded-full border-b-2 border-r-2 px-3 py-1">Ver mais</button>
    </div>
  )
}