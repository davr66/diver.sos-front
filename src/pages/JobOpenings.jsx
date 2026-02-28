import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListItem from '../components/ListItem'
import SearchBar from '../components/SearchBar';
import Filter from '../components/Filter';
import CascadingFilter from '../components/CascadingFilter';
import { searchJobOpenings, getMyFavoriteJobs, getSkills } from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import Feedback from '../components/Feedback';

const MODE_TO_ENUM = { remoto: 'REMOTO', hibrido: 'HIBRIDO', presencial: 'PRESENCIAL' };

export default function JobApplications(){
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobOpenings,setJobOpenings] = useState([]);
  const [search,setSearch] = useState(searchParams.get('q') || "");
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('q') || "");
  const [isLoading, setIsLoading] = useState(true);
  const [workModeFilters, setWorkModeFilters] = useState(() => {
    const v = searchParams.get('modo');
    return v ? v.split(',').filter(Boolean) : [];
  });
  const [selectedState, setSelectedState] = useState(() => {
    const v = searchParams.get('uf');
    return v ? [v] : [];
  });
  const [selectedCities, setSelectedCities] = useState(() => {
    const v = searchParams.get('cidades');
    return v ? v.split(',').filter(Boolean) : [];
  });
  const [selectedSkillIds, setSelectedSkillIds] = useState(() => { // normalized string ids (ex: ['1','2'])
    const v = searchParams.get('habilidades');
    return v ? v.split(',').filter(Boolean) : [];
  });
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const fetchIdRef = useRef(0);

  const showFeedback = (type, heading, message) => {
    setFeedback({ type, heading, message });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (appliedSearch.trim()) params.set('q', appliedSearch.trim());
    if (workModeFilters.length > 0) params.set('modo', workModeFilters.join(','));
    if (selectedSkillIds.length > 0) params.set('habilidades', selectedSkillIds.join(','));
    if (selectedState.length > 0) params.set('uf', selectedState[0]);
    if (selectedCities.length > 0) params.set('cidades', selectedCities.join(','));
    setSearchParams(params, { replace: true });
  }, [appliedSearch, workModeFilters, selectedSkillIds, selectedState, selectedCities, setSearchParams]);

  const fetchJobs = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current;
    try {
      const params = {};
      if (appliedSearch.trim()) params.termo = appliedSearch.trim();
      if (workModeFilters.length === 1 && MODE_TO_ENUM[workModeFilters[0]]) {
        params.modalidade = MODE_TO_ENUM[workModeFilters[0]];
      }
      if (selectedCities.length === 1) {
        params.cidade = selectedCities[0];
      }
      const response = await searchJobOpenings(params);
      if (currentFetchId === fetchIdRef.current) {
        setJobOpenings(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [appliedSearch, workModeFilters, selectedCities]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const response = await getSkills();
        const skills = Array.isArray(response?.data) ? response.data : [];
        setSkillsOptions(skills.map(skill => ({
          value: String(skill.id),
          label: skill.nome || skill.name || String(skill.id)
        })));
      } catch (error) {
        console.error('Erro ao carregar habilidades:', error);
        setSkillsOptions([]);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

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

  const handleSearchSubmit = () => {
    setIsLoading(true);
    setSelectedState([]);
    setSelectedCities([]);
    setSelectedSkillIds([]);
    setAppliedSearch(search);
  };

  const normalize = (str) => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  useEffect(() => {
    if (search.trim() === "") {
      setAppliedSearch("");
    }
  }, [search]);

  const selectedSkillIdNums = selectedSkillIds
    .map(v => Number(v))
    .filter(n => !Number.isNaN(n));

  const filteredJobs = jobOpenings.filter(job => {
    if (workModeFilters.length > 0 && !workModeFilters.includes(normalize(job.work_mode))) {
      return false;
    }
    if (selectedState.length > 0 && !selectedState.includes(normalize(job.uf))) {
      return false;
    }
    if (selectedCities.length > 0 && !selectedCities.includes(normalize(job.city))) {
      return false;
    }

    if (selectedSkillIdNums.length > 0) {
      const rawSkills = job?.skills || job?.habilidades || [];
      const jobSkillIds = Array.isArray(rawSkills)
        ? rawSkills
            .map(s => (typeof s === 'object' && s !== null ? s.id : s))
            .map(v => Number(v))
            .filter(n => !Number.isNaN(n))
        : [];
      if (!selectedSkillIdNums.some(id => jobSkillIds.includes(id))) {
        return false;
      }
    }

    return true;
  }); 

  return(
    <>
      {isLoading ? (<Loading/>):(
      <div className='flex flex-col items-center px-4 lg:px-10 pt-5'>
        <div className='flex flex-col gap-2 mt-2 mb-5 w-full'>
          <SearchBar value={search} onChange={setSearch} onSubmit={handleSearchSubmit} placeholder='Pesquisar vagas...'></SearchBar>
          <div className='flex gap-2 flex-wrap'>
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

            <Filter
              value={selectedSkillIds}
              onChange={setSelectedSkillIds}
              options={skillsOptions}
              label={loadingSkills ? 'Habilidades...' : 'Habilidades'}
              useDefaultOptions={false}
            />

            <CascadingFilter
              onStateChange={setSelectedState}
              onCityChange={setSelectedCities}
              buttonColor="#FFE79D"
              initialState={selectedState}
              initialCities={selectedCities}
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