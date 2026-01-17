import Card from "./Card"
export default function NewsArticle({title,description,imgSrc,textColor,link, aditionalClasses}){
  return (
    <div className="flex flex-col gap-2 items-center">
      <Card
      aditionalClasses={aditionalClasses}
      title={title}
      description={description}
      imgSrc={imgSrc}
      textColor={textColor}
      bgColor={"bg-[var(--news-bg)]"}>
        <a
          className="hover:cursor-pointer hover:text-gray-200 self-end font-bold underline text-sm text-white mt-1"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          Ver mais
        </a>
      </Card>
    </div>
  )
}