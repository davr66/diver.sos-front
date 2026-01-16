import { useState,useEffect } from 'react';
import ListItem from '../components/ListItem'
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import CascadingFilter from '../components/CascadingFilter';
import {getJobOpenings, searchJobOpenings, getMyFavoriteJobs} from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import Feedback from '../components/Feedback';

export default function JobApplications(){
  const { isAuthenticated } = useAuth();
  const [jobOpenings,setJobOpenings] = useState([]);
  const [search,setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workModeFilters, setWorkModeFilters] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, heading, message) => {
    setFeedback({ type, heading, message });
  };

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

  useEffect(()=>{
    if (!isAuthenticated) {
      setSavedJobIds([]);
      return;
    }
    
    const fetchSavedJobs = async () =>{
      try {
        const response = await getMyFavoriteJobs();
        const ids = response.data.map(job => job.id);
        setSavedJobIds(ids);
      } catch (error) {
        console.error('Erro ao carregar vagas salvas:', error);
      }
    };
    fetchSavedJobs();
  },[isAuthenticated]);

  const handleSearchSubmit = async () => {
    setIsLoading(true);
    setSelectedState([]);
    setSelectedCities([]);
    try {
      const response = await searchJobOpenings({ termo: search });
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
      <div className='flex flex-col items-center px-4 lg:px-10'>
        <div className='flex flex-col gap-2 mt-2 mb-5 w-full'>
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
              buttonColor="#FFE79D"
            />
          </div>
        </div>

        <div className='flex flex-col items-center w-full'>
          {filteredJobs.map((job,index)=>(
            <ListItem 
              key={index} 
              data={job} 
              type="job_opening" 
              isSaved={savedJobIds.includes(job.id)}
              onError={showFeedback}
            />
          ))}

          {search.trim() !== "" && filteredJobs.length === 0 &&(
            <p>Nenhuma vaga encontrada</p>
          )}
        </div>
      </div>)}
    
      {feedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}
    </>
  );
}