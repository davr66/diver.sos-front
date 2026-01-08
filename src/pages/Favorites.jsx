import ListItem from "../components/ListItem";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import favoritesImg from "../assets/favorites.svg";

export default function SupportGroups(){
  const {isAuthenticated} = useAuth();

  const favoritesList = [
  {
    "nome": "TransVoz",
    "categoria": "Pessoas Trans",
    "descricao": "Rede de acolhimento e orientação para pessoas trans e travestis, com rodas de conversa e apoio psicológico."
  },
  {
    "nome": "Mães Pela Diversidade",
    "categoria": "Famílias",
    "descricao": "Grupo nacional formado por mães, pais e responsáveis que acolhem e apoiam filhos LGBTQIA+."
  },
  {
    "nome": "União Bi+",
    "categoria": "Bissexuais",
    "descricao": "Coletivo voltado para pessoas bissexuais e pansexuais, com foco em apoio mútuo e combate ao apagamento bi+."
  },
  {
    "nome": "Aurora LGBT",
    "categoria": "Saúde Mental",
    "descricao": "Grupo de acolhimento emocional, oferecendo escuta ativa e atividades para fortalecer autoestima."
  },
  {
    "nome": "Coletivo As Lésbicas",
    "categoria": "Mulheres Lésbicas",
    "descricao": "Espaço seguro para mulheres lésbicas discutirem vivências, afetos, direitos e fortalecerem redes de apoio."
  },
  {
    "nome": "Arco-Íris Jovem",
    "categoria": "Juventude",
    "descricao": "Grupo dedicado a jovens LGBTQIA+, com encontros formativos, culturais e rodas de troca."
  },
  {
    "nome": "GTF — Grupo Terapêutico da Família",
    "categoria": "Famílias",
    "descricao": "Apoio psicológico e social para familiares que buscam compreender e apoiar seus parentes LGBTQIA+."
  },
  {
    "nome": "Diversus+ Idade",
    "categoria": "LGBT Idosos",
    "descricao": "Grupo voltado a pessoas LGBTQIA+ acima de 50 anos, promovendo inclusão, socialização e cuidado emocional."
  },
  {
    "nome": "Coletivo Não-Bináries em Movimento",
    "categoria": "Identidades Não-Binárias",
    "descricao": "Rede de acolhimento e troca para pessoas não-binárias, discutindo experiência, saúde e identidade."
  },
  {
    "nome": "TransFormando Vidas",
    "categoria": "Pessoas Trans",
    "descricao": "Rede de apoio focada em empregabilidade, saúde e bem-estar de pessoas trans e travestis."
  },
]

  return(
    <div className="flex flex-col items-center">
    {isAuthenticated ? 
      favoritesList.map((favorite,index)=>(<ListItem key={index} data={favorite}/>))
    :(
      <div className="flex flex-col items-center self-center gap-10 lg:scale-120 lg:justify-end">
        <img className="w-70"src={favoritesImg} alt="Ilustração de uma mulher usando um computador" />
        <div className="flex flex-col items-center">
          <h1 className="font-[Nunito] font-bold text-2xl">Seus favoritos ficam aqui</h1>
          <p className="max-w-60 font-medium text-sm text-center" >Entre com sua conta para salvar vagas e grupos de apoio para ver depois!</p>
        </div>
        <Link className="border-2 border-b-3 border-r-3 rounded-md bg-[var(--favorites-bg)] px-4 py-3 uppercase text-sm font-bold hover:bg-[#cc2121]" to="/login">Ir para o login</Link>
      </div>
    )}
    </div>
  )
}