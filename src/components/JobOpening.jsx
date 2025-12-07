export default function JobOpening({title,company,location,work_mode}){
  return(
    <div className="flex flex-col pb-5 pt-1 border-t-2 w-[95%]">
      <h3 className="text-base font-bold uppercase">{title}</h3>
      <p className="text-sm"><span></span>{company}</p>
      <p className="text-sm"><span></span>{location}</p>
      <p className="text-sm"><span></span>{work_mode}</p>
    </div>
  )
}