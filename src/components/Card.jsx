export default function Card({imgSrc,category,title,description,bgColor,textColor=""}){
  return (
    <div className={`flex flex-col border rounded-2xl border-2 border-b-5 ${bgColor} max-h-[13.75rem] gap-1 max-w-[20rem]`}>
      <div className="h-3/5 w-full overflow-hidden">
        <img className="rounded-t-2xl w-full h-full object-cover" src={imgSrc}/>
      </div>
      <div className="flex flex-col rounded-b-xl m-2">
        {category ? <span className="uppercase font-bold text-[.6rem]">{category}</span> : ""}
        <h2 className={`text-lg font-bold font-[Nunito] ${textColor} leading-5`}>{title}</h2>
        <p className={`text-[.7rem] ${textColor} mt-2`}>{description}</p>
      </div>
    </div>
  );
}