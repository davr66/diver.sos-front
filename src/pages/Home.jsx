import Card from "../components/Card";
import NewsArticle from "../components/NewsArticle";
import imagem1 from '../assets/cards/image1.png';
import imagem2 from '../assets/cards/image2.png';
import imagem3 from '../assets/cards/image3.png';
import imagem4 from '../assets/cards/image4.png';
import imagem5 from '../assets/cards/image5.png';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNews } from "../services/api";
import Loading from "../components/Loading";

export default function Home() {
  const navigate = useNavigate();
  const [news,setNews] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const fetchNews = async()=>{
      try{
        const response = await getNews();
        setNews(response.data);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    }
    
    fetchNews();
  },[])

  if(loading) return <Loading/>

  return (
    <div className="flex flex-col gap-10 px-8 mx-auto items-center">
      <div className="flex flex-col">
        <h1 className="font-[Nunito] font-extrabold text-xl mb-1 lg:text-center lg:text-4xl lg:mb-3">Somos a diver.sos!</h1>
        <p className="text-[.7rem] lg:text-sm lg:self-center lg:text-center lg:w-[50%]">Conectamos você a vagas em empresas inclusivas e a grupos de apoio reais. Aqui, sua identidade é celebrada e sua carreira é levada a sério. Encontre seu espaço seguro.</p>
      </div>

      <div className="grid
      grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]
      place-items-center gap-10
      w-full">
        <Card imgSrc={imagem2}
          category="vagas"
          title="Oporturnidades Inclusivas"
          description="Encontre vagas em empresas verificadas que respeitam sua identidade."
          bgColor="bg-[var(--jobs-bg)]"
          interactiveClasses="hover:cursor-pointer hover:translate-y-[-4px] hover:shadow-md transition-all"
          onClick={()=>navigate('vagas')}
        ></Card>
        <Card imgSrc={imagem1}
          category="comunidades"
          title="Grupos de Apoio"
          description="Troque experiências e encontre acolhimento em grupos online e presenciais."
          bgColor="bg-[var(--home-bg)]"
          interactiveClasses="hover:cursor-pointer hover:translate-y-[-4px] hover:shadow-md transition-all"
          onClick={()=>navigate('grupos')}
        ></Card>

      </div>

      <section className="flex flex-col items-center">
        <h2 className="text-xl font-bold font-[nunito] mb-3 lg:text-2xl lg:mb-3 self-start md:self-center">Feed de Notícias</h2>
        <div className="grid
      grid-cols-[repeat(auto-fit,minmax(19rem,1fr))]
      gap-10
      w-full">
        {news.map((newsArticle,index)=>(
          <NewsArticle
            key={index}
            index={index}
            title={newsArticle.titulo}
            imgSrc={newsArticle.imgUrl}
            description={newsArticle.conteudo}
            textColor={'text-white'}
            link={newsArticle.link}
          />
        ))}
        </div>
      </section>
    </div>
  )
}