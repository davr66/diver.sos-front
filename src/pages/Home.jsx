import Card from "../components/Card";
import imagem1 from '../assets/cards/image1.png'
import imagem2 from '../assets/cards/image2.png'

export default function Home(){
  return(
    <div className=" flex flex-col gap-8 px-8 mx-auto mt-8">
      <div>
        <h1 className="font-[Nunito] font-extrabold text-lg mb-5">Somos a diver.sos!</h1>
        <p className="text-[.7rem]">Conectamos você a vagas em empresas inclusivas e a grupos de apoio reais. Aqui, sua identidade é celebrada e sua carreira é levada a sério. Encontre seu espaço seguro.</p>
      </div>

      <Card imgSrc={imagem1}
        category="comunidades"
        title="Grupos de Apoio"
        description="Troque experiências e encontre acolhimento em grupos online e presenciais."
        bgColor="bg-[var(--home-bg)]"
      ></Card>

      <Card imgSrc={imagem2}
        category="vagas"
        title="Oporturnidades Inclusivas"
        description="Encontre vagas em empresas verificadas que respeitam sua identidade."
        bgColor="bg-[var(--jobs-bg)]"
      ></Card>
    </div>
  )
}