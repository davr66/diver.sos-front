import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import workModeIcon from '../assets/job-applications/work-mode.svg';
import { Link } from 'react-router-dom';
import SaveBtn from './SaveBtn';
import { saveJobOpening, deleteSavedJobOpening } from '../services/api';
import { useState, useEffect, useRef } from 'react';


export default function JobOpening({data, type, isSaved = false, onError }) {
  const id = data.id;
  const [saved, setSaved] = useState(isSaved);
  const userInteracted = useRef(false);

  // Sincroniza com a prop apenas se o usuário não interagiu
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
      if (previousState) {
        await deleteSavedJobOpening(id);
      } else {
        await saveJobOpening(id);
      }
    } catch (error) {
      console.error("Erro ao salvar/deletar vaga:", error);
      setSaved(previousState);
      
      // Mostrar feedback de erro
      if (onError) {
        if (error?.response?.status === 403) {
          onError('error', 'Acesso negado', 'Faça login para salvar vagas nos seus favoritos.');
        } else {
          onError('error', 'Erro ao salvar vaga', 'Não foi possível salvar a vaga. Tente novamente.');
        }
      }
    }
  };

  return (
    <div className="flex justify-between pb-5 pt-2 border-t-2 w-[95%] relative nth-last-1:border-b-2">
      {type == 'job_opening' ? (
        <div className="flex flex-col">
            <h3 className="text-sm text-wrap max-w-75 font-bold uppercase">{data.title}</h3>
            <div className="flex flex-col gap-2 mt-1">
              <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon}/>{data.company}</p>
              <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon}/>{data.city}/{data.uf}</p>
              <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1px" src={workModeIcon}/>{data.work_mode ==='Hibrido' ? 'Híbrido' : data.work_mode}</p>
            </div>
        </div>)
        : (
          <div className="flex flex-col">
            <h3 className="text-sm text-nowrap text-balance font-bold uppercase">{data.nome}</h3>
            <span className="text-[0.75rem] font-semibold text-gray-700">{data.categoria}</span>
            <p className="text-[0.65rem] text-wrap w-[75%] line-clamp-3">{data.descricao}</p>
          </div>
          )
      }
      <div className="flex-shrink-0">
        <SaveBtn key={`save-${id}-${saved}`} active={saved} onClick={handleSave}/>
      </div>
      <Link to={type ==='job_opening' ? `/vagas/${id}`:`/grupos/${id}`} className="absolute right-0 bottom-3 text-nowrap text-sm font-bold border rounded-md border-b-3 bg-white border-r-3 px-5 py-2 hover:cursor-pointer hover:shadow-sm hover:bg-gray-100 hover:scale-102 transition-all">Ver mais</Link>
    </div>
  )
}