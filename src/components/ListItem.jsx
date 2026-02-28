import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import workModeIcon from '../assets/job-applications/work-mode.svg';
import { Link } from 'react-router-dom';
import SaveBtn from './SaveBtn';
import { saveJobOpening, deleteSavedJobOpening, saveGroup, deleteSavedGroup } from '../services/api';
import { useState, useEffect, useRef } from 'react';


export default function JobOpening({data, type, isSaved = false, onError }) {
  const id = data.id;
  const [saved, setSaved] = useState(isSaved);
  const userInteracted = useRef(false);

  useEffect(() => {
    if (!userInteracted.current) {
      setSaved(isSaved);
    }
  }, [isSaved]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    userInteracted.current = true;
    const previousState = saved;
    const newState = !saved;
    
    setSaved(newState);
    
    try {
      if (type === 'job_opening') {
        if (previousState) {
          await deleteSavedJobOpening(id);
        } else {
          await saveJobOpening(id);
        }
      } else {
        if (previousState) {
          await deleteSavedGroup(id);
        } else {
          await saveGroup(id);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar/deletar item:", error);
      setSaved(previousState);
      
      if (onError) {
        const isForbidden = error?.response?.status === 403;
        const isJob = type === 'job_opening';
        const entityLabel = isJob ? 'vaga' : 'grupo';
        const loginMsg = isJob
          ? 'Faça login para salvar vagas nos seus favoritos.'
          : 'Faça login para salvar grupos nos seus favoritos.';
        const genericMsg = isJob
          ? 'Não foi possível salvar a vaga. Tente novamente.'
          : 'Não foi possível salvar o grupo. Tente novamente.';

        onError('error', isForbidden ? 'Acesso negado' : `Erro ao salvar ${entityLabel}`, isForbidden ? loginMsg : genericMsg);
      }
    }
  };

  return (
    <div
      data-testid={type === 'job_opening' ? 'job-card' : 'group-card'}
      className="flex justify-between pb-5 pt-2 border-t-2 w-full relative nth-last-1:border-b-2 min-h-30">
        <div className="flex flex-col">
            <h3 className="text-sm text-wrap max-w-75 font-bold uppercase">{data.title ? data.title : data.nome}</h3>
            {type == 'group' && <span className="text-[0.75rem] font-semibold text-gray-700">{data.categoria}</span>}
            <div className="flex flex-col gap-2 mt-1">
              <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon}/>{data.company ? data.company : data.responsavel}</p>
              <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon}/>{data.city ? data.city : data.cidade}/{data.uf ? data.uf : data.estado}</p>
              {type == 'job_opening' && <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1px" src={workModeIcon}/>{data.work_mode ==='Hibrido' ? 'Híbrido' : data.work_mode}</p> }
            </div>
        </div>
      <div className="flex-shrink-0">
        <SaveBtn active={saved} onClick={handleSave}/>
      </div>
      <Link to={type ==='job_opening' ? `/vagas/${id}`:`/grupos/${id}`} className="absolute right-0 bottom-3 text-nowrap text-sm font-bold border rounded-md border-b-3 bg-white border-r-3 px-5 py-2 hover:cursor-pointer hover:shadow-sm hover:bg-gray-100 hover:scale-102 transition-all">Ver mais</Link>
    </div>
  )
}