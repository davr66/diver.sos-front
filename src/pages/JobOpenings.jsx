import { useState,useEffect } from 'react';
import ListItem from '../components/ListItem'
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import CascadingFilter from '../components/CascadingFilter';
import {getJobOpenings, searchJobOpenings} from '../services/api';
import Loading from '../components/Loading';

export default function JobApplications(){
  const [jobOpenings,setJobOpenings] = useState([]);
  const [search,setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workModeFilters, setWorkModeFilters] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

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
    // Reset location filters when using search bar
    setSelectedState([]);
    setSelectedCities([]);
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

  const filteredJobs = jobOpenings.filter(job => {
    // Filter by work mode
    if (workModeFilters.length > 0 && !workModeFilters.includes(normalize(job.work_mode))) {
      return false;
    }
    // Filter by state (comparing with state abbreviation/sigla)
    if (selectedState.length > 0 && !selectedState.includes(normalize(job.uf))) {
      return false;
    }
    // Filter by cities
    if (selectedCities.length > 0 && !selectedCities.includes(normalize(job.city))) {
      return false;
    }
    return true;
  }); 

  return(
    <>
      {isLoading ? (<Loading/>):(
      <div className='flex flex-col items-center'>
        <div className='flex flex-col gap-2 mt-2 mb-5 w-[90%]'>
          <SearchBar value={search} onChange={setSearch} onSubmit={handleSearchSubmit} placeholder='Pesquisar vagas...'></SearchBar>
          <div className='flex gap-2'>
            <Filter
              value={workModeFilters}
              onChange={setWorkModeFilters}
              options={[
                { value: 'Remoto', label: 'Remoto' },
                { value: 'Híbrido', label: 'Híbrido' },
                { value: 'Presencial', label: 'Presencial' },
              ]}
              label="Modalidade"
            />
            <CascadingFilter
              onStateChange={setSelectedState}
              onCityChange={setSelectedCities}
            />
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