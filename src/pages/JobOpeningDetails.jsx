import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getJobById, getMyFavoriteJobs, saveJobOpening, deleteSavedJobOpening } from '../services/api';
import { useAuth } from '../context/AuthContext';
import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import workModeIcon from '../assets/job-applications/work-mode.svg';
import BackButton from '../components/BackBtn';
import SaveBtn from '../components/SaveBtn';
import Feedback from '../components/Feedback';


export default function JobDetails() {
  const api = import.meta.env.VITE_API_URL;
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const showFeedback = (type, heading, message) => setFeedback({ type, heading, message });

  useEffect(() => {
    getJobById(id).then(res => setJob(res.data));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }

    const fetchSavedStatus = async () => {
      try {
        const response = await getMyFavoriteJobs();
        const isSavedJob = response.data.some(savedJob => savedJob.id === parseInt(id));
        setIsSaved(isSavedJob);
      } catch (error) {
        console.error('Erro ao verificar se vaga está salva:', error);
      }
    };
    fetchSavedStatus();
  }, [id, isAuthenticated]);

  const handleSave = async () => {
    const previousState = isSaved;
    const newState = !isSaved;
    setIsSaved(newState);

    try {
      if (previousState) {
        await deleteSavedJobOpening(id);
      } else {
        await saveJobOpening(id);
      }
    } catch (error) {
      console.error('Erro ao salvar/deletar vaga:', error);
      setIsSaved(previousState);

      const isForbidden = error?.response?.status === 403;
      const loginMsg = 'Faça login para salvar vagas nos seus favoritos.';
      const genericMsg = 'Não foi possível salvar a vaga. Tente novamente.';
      showFeedback('error', isForbidden ? 'Acesso negado' : 'Erro ao salvar vaga', isForbidden ? loginMsg : genericMsg);
    }
  };

  if (!job) return <p>Carregando...</p>;
  console.log('Job data:', job);
  console.log('Banner URL:', job.bannerDaVaga ? `${api}${job.bannerDaVaga}` : 'No banner');

  return (
    <div>
      {job.bannerDaVaga && (
        <div 
          style={{ backgroundImage: `url('${api}${job.bannerDaVaga}')` }}
          className="bg-cover bg-center bg-no-repeat w-full h-40 md:h-48 flex-shrink-0 mb-5 border-1"
        ></div>
      )}
      <div className="px-[1rem]">
       <BackButton className="self-start" fallback='/vagas'></BackButton>
        <div className="flex justify-between min-h-[40%] py-4">
        <div className="flex flex-col gap-2">
          <h3 className="flex items-center text-lg text-nowrap text-pretty font-bold uppercase leading-none mb-1"> {job.title}</h3>
          <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon} />{job.company}</p>
          <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon} />{job.city}/{job.uf}</p>
          <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1px" src={workModeIcon} />{job.work_mode === 'Hibrido' ? 'Híbrido' : job.work_mode}</p>
        </div>
        <div className="flex flex-col items-end justify-between min-h-full">
          <SaveBtn active={isSaved} onClick={handleSave}></SaveBtn>
          <a href={job.jobLink} className="text-nowrap mt-5 bg-[#FFDF7B] py-2 px-3 rounded-md border-2 border-r-4 border-b-4 hover:cursor-pointer hover:bg-[#d1b14b]" target="_blank">Ir para a vaga</a>
        </div>
      </div>

      <div className='flex flex-col py-4 gap-5'>
        <div className='prose prose-sm max-w-none whitespace-pre-line leading-relaxed break-words overflow-wrap-anywhere'>
          {job.description || ''}
        </div>
        <div>
          <h2 className='font-semibold text-lg mb-2'>Habilidades</h2>
          <div className='flex flex-wrap gap-2'>
            {job.skills && job.skills.map((skill)=>(<span className='font-medium rounded-md py-1 px-1 bg-[var(--jobs-bg)] text-sm' key={skill.id}>{skill.nome}</span>))}
          </div>
        </div>
      </div>
      {feedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}
      </div>
    </div>
  )
}