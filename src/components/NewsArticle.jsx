import Card from "./Card"
export default function NewsArticle({title,description,imgSrc,text,textColor,link}){
  return (
    <div className="flex flex-col gap-2 py-4 border-b-2 items-center">
      <Card
      title={title}
      description={description}
      imgSrc={imgSrc}
      textColor={textColor}
      bgColor={"bg-[var(--news-bg)]"}>
        <a className="self-end font-bold underline text-sm text-white mt-1" href={link}target="_blank">Ver mais</a>
      </Card>
    </div>
  )
}