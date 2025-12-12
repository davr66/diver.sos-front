import ListItem from "../components/ListItem"

export default function SupportGroups(){
  const groupList = [
  {
    "title": "TransVoz",
    "category": "Pessoas Trans",
    "description": "Rede de acolhimento e orientação para pessoas trans e travestis, com rodas de conversa e apoio psicológico."
  },
  {
    "title": "Mães Pela Diversidade",
    "category": "Famílias",
    "description": "Grupo nacional formado por mães, pais e responsáveis que acolhem e apoiam filhos LGBTQIA+."
  },
  {
    "title": "União Bi+",
    "category": "Bissexuais",
    "description": "Coletivo voltado para pessoas bissexuais e pansexuais, com foco em apoio mútuo e combate ao apagamento bi+."
  },
  {
    "title": "Aurora LGBT",
    "category": "Saúde Mental",
    "description": "Grupo de acolhimento emocional, oferecendo escuta ativa e atividades para fortalecer autoestima."
  },
  {
    "title": "Coletivo As Lésbicas",
    "category": "Mulheres Lésbicas",
    "description": "Espaço seguro para mulheres lésbicas discutirem vivências, afetos, direitos e fortalecerem redes de apoio."
  },
  {
    "title": "Arco-Íris Jovem",
    "category": "Juventude",
    "description": "Grupo dedicado a jovens LGBTQIA+, com encontros formativos, culturais e rodas de troca."
  },
  {
    "title": "GTF — Grupo Terapêutico da Família",
    "category": "Famílias",
    "description": "Apoio psicológico e social para familiares que buscam compreender e apoiar seus parentes LGBTQIA+."
  },
  {
    "title": "Diversus+ Idade",
    "category": "LGBT Idosos",
    "description": "Grupo voltado a pessoas LGBTQIA+ acima de 50 anos, promovendo inclusão, socialização e cuidado emocional."
  },
  {
    "title": "Coletivo Não-Bináries em Movimento",
    "category": "Identidades Não-Binárias",
    "description": "Rede de acolhimento e troca para pessoas não-binárias, discutindo experiência, saúde e identidade."
  },
  {
    "title": "TransFormando Vidas",
    "category": "Pessoas Trans",
    "description": "Rede de apoio focada em empregabilidade, saúde e bem-estar de pessoas trans e travestis."
  },
]

  return(
    <div className="flex flex-col items-center">
      {groupList.map((group,index)=>(<ListItem index={index} data={group}/>))}
    </div>
    
  )
}