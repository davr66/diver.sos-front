import Card from "./Card"
export default function NewsArticle({title,description,imgSrc,text,textColor}){
  return (
    <div className="flex flex-col gap-2 py-4 border-b-2 items-center">
      <Card
      title={title}
      description={description}
      imgSrc={imgSrc}
      textColor={textColor}
      bgColor={"bg-[var(--news-bg)]"}></Card>
      <p className="text-justify whitespace-pre-line leading-relaxed text-[.75rem] lg:mt-2">{text}</p>
      <a className="self-end font-bold underline text-sm" href="#" target="_blank">Ver mais</a>
    </div>
  )
}