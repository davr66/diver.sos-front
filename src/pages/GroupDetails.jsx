import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGroupById, getMyGroups, saveGroup, deleteSavedGroup } from '../services/api';
import { useAuth } from '../context/AuthContext';
import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import verifiedIcon from '../assets/groups/verified.svg'
import BackButton from '../components/BackBtn';
import SaveBtn from '../components/SaveBtn';
import Loading from '../components/Loading';
import Feedback from '../components/Feedback';
import RichTextViewer from '../components/RichTextViewer';

export default function JobDetails() {
  const api = import.meta.env.VITE_API_URL;
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const showFeedback = (type, heading, message) => setFeedback({ type, heading, message });

  useEffect(() => {
    getGroupById(id).then(res => setGroup(res.data));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsSaved(false);
      return;
    }

    const fetchSavedStatus = async () => {
      try {
        const response = await getMyGroups();
        const ids = Array.isArray(response?.data) ? response.data.map(g => g.id) : [];
        setIsSaved(ids.includes(parseInt(id)));
      } catch (error) {
        console.error('Erro ao verificar se grupo está salvo:', error);
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
        await deleteSavedGroup(id);
      } else {
        await saveGroup(id);
      }
    } catch (error) {
      console.error('Erro ao salvar/deletar grupo:', error);
      setIsSaved(previousState);

      const isForbidden = error?.response?.status === 403;
      const loginMsg = 'Faça login para salvar grupos nos seus favoritos.';
      const genericMsg = 'Não foi possível salvar o grupo. Tente novamente.';
      showFeedback('error', isForbidden ? 'Acesso negado' : 'Erro ao salvar grupo', isForbidden ? loginMsg : genericMsg);
    }
  };

  console.log(group);

  if (!group) return <Loading/>;

  return (
    <div>
      {group.bannerDoGrupo && (
        <div 
          style={{ backgroundImage: `url(${api}${group.bannerDoGrupo})` }}
          className="bg-cover bg-center bg-no-repeat w-full h-40 md:h-48 flex-shrink-0 border-1"
        ></div>
      )}
      <div className='px-[1rem] relative lg:px-40 mt-5'>
      <BackButton fallback='/grupos'></BackButton>
      <div className="flex justify-between min-h-[40%] py-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg text-nowrap text-pretty font-bold uppercase leading-none">{group.nome}</h3>
          <span className='flex items-center gap-1 uppercase text-[.6rem] leading-none font-semibold text-nowrap mb-2'><img src={verifiedIcon} />Espaço seguro verificado</span>
          <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon} />{group.responsavel}</p>
          <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon} />{group.cidade}/{group.estado}</p>
        </div>
        <div className="flex flex-col items-end justify-between min-h-full">
          <SaveBtn active={isSaved} onClick={handleSave}></SaveBtn>
          <a href={group.link} className="text-sm font-bold text-nowrap uppercase mt-5 bg-[var(--groups-bg)] py-2 px-3 rounded-lg border-2 border-r-4 border-b-4 hover:cursor-pointer hover:bg-[#d17b95] hover:scale-104 translate-y-1" target="_blank">quero participar</a>
        </div>
      </div>

      <div className='flex flex-col py-4'>
        {group.descricao && (
          <RichTextViewer content={group.descricao} className="prose prose-sm max-w-none" />
        )}
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