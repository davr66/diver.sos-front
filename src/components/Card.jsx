export default function Card({imgSrc,category,title,description,bgColor}){
  return (
    <div className={`flex flex-col border rounded-2xl border-2 border-b-5 ${bgColor}`}>
      <div >
        <img className="rounded-t-2xl" src={imgSrc}/>
      </div>
      <div className="rounded-b-xl m-2">
        <span className="uppercase font-bold text-[.8rem]">{category}</span>
        <h2 className="text-lg font-bold font-[Nunito]">{title}</h2>
        <p className="text-[.7rem]">{description}</p>
      </div>
    </div>
  );
}