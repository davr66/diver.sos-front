import { FavoriteIcon, FavoriteIconFilled } from '../assets/nav';
import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import workModeIcon from '../assets/job-applications/work-mode.svg';

export default function JobOpening({data, type }) {
  return (
    <div className="flex justify-between pb-5 pt-1 border-t-2 w-[95%] relative nth-last-1:border-b-2">
      {type == 'job_opening' ? (
        <div className="flex flex-col">
            <h3 className="text-sm text-nowrap text-pretty font-bold uppercase">{data.title}</h3>
            <div className="flex flex-col gap-2 mt-1">
              <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon}/>{data.company}</p>
              <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon}/>{data.location}</p>
              <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1px" src={workModeIcon}/>{data.work_mode}</p>
            </div>
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