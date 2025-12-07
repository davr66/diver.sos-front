import { useState } from 'react';
import JobOpening from '../components/JobOpening'
import SearchBar from '../components/SearchBar';

export default function JobApplications(){
  const [search,setSearch] = useState("");
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

  const filteredJobs = search.trim() === "" ? jobOpenings:jobOpenings.filter(job=>{
    const term = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job.work_mode.toLowerCase().includes(term) 
    )
  })

  return(
    <div className='flex flex-col items-center'>
      <SearchBar value={search} onChange={setSearch} placeholder='Pesquisar vagas...'></SearchBar>

      <div className='w-[95%] flex flex-col items-center'>
        {filteredJobs.map((job,index)=>(
          <JobOpening key={index} title={job.title} company={job.company} location={job.location} work_mode={job.work_mode}></JobOpening>
        ))}

        {search.trim() !== "" && filteredJobs.length === 0 &&(
          <p>Nenhuma vaga encontrada</p>
        )}
      </div>
    </div>
  );
}