import JobOpening from '../components/JobOpening'

export default function JobApplications(){
  const jobOpenings = [
  {
    "title": "Desenvolvedor Front-end Júnior",
    "company": "TechNova Solutions",
    "location": "São Paulo, SP",
    "work_mode": "Híbrido"
  },
  {
    "title": "Analista de Suporte Técnico",
    "company": "Infoline Serviços",
    "location": "Fortaleza, CE",
    "work_mode": "Presencial"
  },
  {
    "title": "Assistente de Marketing Digital",
    "company": "Agência MídiaMax",
    "location": "Belo Horizonte, MG",
    "work_mode": "Remoto"
  },
  {
    "title": "Designer UX/UI",
    "company": "PixelCraft Studio",
    "location": "Curitiba, PR",
    "work_mode": "Híbrido"
  },
  {
    "title": "Assistente Administrativo",
    "company": "Grupo Orion",
    "location": "Recife, PE",
    "work_mode": "Presencial"
  },
  {
    "title": "Desenvolvedor Back-end (Node.js)",
    "company": "CloudBridge Tech",
    "location": "Rio de Janeiro, RJ",
    "work_mode": "Remoto"
  },
  {
    "title": "Analista de Dados Júnior",
    "company": "DataFlow Analytics",
    "location": "Porto Alegre, RS",
    "work_mode": "Híbrido"
  },
  {
    "title": "Representante de Suporte ao Cliente",
    "company": "HelpNow Contact Center",
    "location": "Salvador, BA",
    "work_mode": "Presencial"
  },
  {
    "title": "Produtor de Conteúdo",
    "company": "Criativa Media House",
    "location": "Brasília, DF",
    "work_mode": "Remoto"
  },
  {
    "title": "Estagiário de TI",
    "company": "Infotech Systems",
    "location": "Campinas, SP",
    "work_mode": "Presencial"
  }
]

  return(
    <div className='flex flex-col items-center'>
      {jobOpenings.map((jobOpening,index) =>(<JobOpening title={jobOpening.title} company={jobOpening.company} location={jobOpening.location} work_mode={jobOpening.work_mode}></JobOpening>) )}
    </div>
  );
}