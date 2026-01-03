import Card from "../components/Card";
import NewsArticle from "../components/NewsArticle";
import imagem1 from '../assets/cards/image1.png';
import imagem2 from '../assets/cards/image2.png';
import imagem3 from '../assets/cards/image3.png';
import imagem4 from '../assets/cards/image4.png';
import imagem5 from '../assets/cards/image5.png'

export default function Home() {
  return (
    <div className="flex flex-col gap-10 px-8 mx-auto items-center">
      <div>
        <h1 className="font-[Nunito] font-extrabold text-xl mb-1 lg:text-center lg:text-4xl lg:mb-3">Somos a diver.sos!</h1>
        <p className="text-[.7rem] lg:text-sm lg:text-center">Conectamos você a vagas em empresas inclusivas e a grupos de apoio reais. Aqui, sua identidade é celebrada e sua carreira é levada a sério. Encontre seu espaço seguro.</p>
      </div>

      <div className="grid
      grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]
      place-items-center gap-10
      w-full">
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

      <section className="flex flex-col items-center">
        <h2 className="text-xl font-bold font-[nunito] mb-3 lg:text-2xl lg:mb-3 self-start md:self-center">Feed de Notícias</h2>
        <div className="grid
      grid-cols-[repeat(auto-fit,minmax(19rem,1fr))]
      gap-10
      w-full">
          <NewsArticle title="Dia da Visibilidade Trans"
            imgSrc={imagem1}
            description={"Dia T oferece serviços para a população LGBTQIA+ de Fortaleza. Conheça os atendimentos"}
            textColor={'text-white'}
            text={"Terça (31/01), 14h-18h, na Adufc: Feira GRATUITA de Serviços, Cultura e Visibilidade para Pessoas Trans e Não Binárias.\nOferta de saúde, beleza, cursos, emprego e orientações sobre direitos.\nEncerramento do Mês da Visibilidade Trans."}
          ></NewsArticle>
          <NewsArticle title="Transforma 2025"
            imgSrc={imagem3}
            description={"Ação gratuita da Defensoria Pública do Ceará para alteração de nome e gênero no registro civil."}
            textColor={'text-white'}
            text={"O mutirão Transforma 2025 está chegando para garantir o seu direito à identidade. Se você é pessoa trans ou travesti e deseja retificar seus documentos gratuitamente, acesse o portal oficial, confira os requisitos e veja como participar desta ação de cidadania."}
          ></NewsArticle>
          <NewsArticle title="Diversidade na TI"
            imgSrc={imagem4}
            description={"Plataforma conecta talentos plurais a oportunidades e bolsas de estudo na área de tecnologia."}
            textColor={'text-white'}
            text={"O Diversifica.dev é um espaço focado em incluir minorias no mercado tech. Encontre vagas afirmativas, programas de capacitação e uma comunidade que apoia seu crescimento. Uma ferramenta essencial para quem busca entrar ou crescer na área de desenvolvimento e design."}
          ></NewsArticle>
          <NewsArticle title="Saúde Mental Gratuita em Fortaleza"
            imgSrc={imagem5}
            description={"Confira a lista atualizada de locais que oferecem acolhimento psicológico gratuito ou social na cidade."}
            textColor={'text-white'}
            text={"Cuidar da mente é prioridade. O Diário do Nordeste reuniu um guia com instituições públicas e clínicas universitárias em Fortaleza que disponibilizam atendimento psicológico gratuito. Acesse a lista completa e encontre o local de acolhimento mais próximo de você."}
          ></NewsArticle>
        </div>
      </section>
    </div>
  )
}