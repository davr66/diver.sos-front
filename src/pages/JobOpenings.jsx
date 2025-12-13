import { useState,useEffect } from 'react';
import ListItem from '../components/ListItem'
import SearchBar from '../components/SearchBar';
import FilterBtn from '../components/FilterBtn';
import {getJobOpenings, searchJobOpenings} from '../services/api';
import Loading from '../components/Loading';

export default function JobApplications(){
  const [jobOpenings,setJobOpenings] = useState([]);
  const [search,setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workModeFilter, setWorkModeFilter] = useState("");

  useEffect(()=>{
    const fetchJobs = async () =>{
      try {
        const response = await getJobOpenings();
        setJobOpenings(response.data);
      } catch (error) {
        console.error('Erro ao carregar vagas:', error);
      }
    };
    fetchJobs();
  },[]);

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await searchJobOpenings({ termo: search }); // backend decides behavior for empty search
      setJobOpenings(response.data);
    } catch (error) {
      console.error('Erro ao procurar vagas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // remove acentos para a exceção do work_mode 'híbrido'
  const normalize = (str) => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const handleFilterToggle = (label) => {
    setWorkModeFilter(prev => (prev === label ? "" : label));
  };

  
  useEffect(() => {
    if (search.trim() !== "") return;

    const reloadAllJobs = async () => {
      try {
        const response = await getJobOpenings();
        setJobOpenings(response.data);
      } catch (error) {
        console.error('Erro ao recarregar vagas:', error);
      }
    };

    reloadAllJobs();
  }, [search]);

  const filteredJobs = workModeFilter
    ? jobOpenings.filter(job => normalize(job.work_mode) === normalize(workModeFilter))
    : jobOpenings;

  return(
    <>
      {isLoading ? (<Loading/>):(
      <div className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 mt-2 mb-5 w-[90%]'>
          <SearchBar value={search} onChange={setSearch} onSubmit={handleSearchSubmit} placeholder='Pesquisar vagas...'></SearchBar>
          <div className='flex gap-1'>
            <FilterBtn label="Remoto" active={normalize(workModeFilter) === normalize('Remoto')} onClick={() => handleFilterToggle('Remoto')} />
            <FilterBtn label="Híbrido" active={normalize(workModeFilter) === normalize('Híbrido')} onClick={() => handleFilterToggle('Híbrido')} />
            <FilterBtn label="Presencial" active={normalize(workModeFilter) === normalize('Presencial')} onClick={() => handleFilterToggle('Presencial')} />
          </div>
        </div>

        <div className='w-[95%] flex flex-col items-center'>
          {filteredJobs.map((job,index)=>(
            <ListItem key={index} data={job} type="job_opening"></ListItem>
          ))}

          {search.trim() !== "" && filteredJobs.length === 0 &&(
            <p>Nenhuma vaga encontrada</p>
          )}
        </div>
      </div>)}
    
    </>
  );
}