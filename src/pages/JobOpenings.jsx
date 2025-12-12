import { useState,useEffect } from 'react';
import ListItem from '../components/ListItem'
import SearchBar from '../components/SearchBar';
import {getJobOpenings, searchJobOpenings} from '../services/api';
import Loading from '../components/Loading';

export default function JobApplications(){
  const [jobOpenings,setJobOpenings] = useState([]);
  const [search,setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // If user clears the search input and doesn't submit, re-fetch all jobs
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

  const filteredJobs = jobOpenings;

  return(
    <>
      {isLoading ? (<Loading/>):(
      <div className='flex flex-col items-center'>
        <SearchBar value={search} onChange={setSearch} onSubmit={handleSearchSubmit} placeholder='Pesquisar vagas...'></SearchBar>

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