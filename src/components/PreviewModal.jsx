import { useState, useEffect } from 'react';
import { getJobById, getGroupById } from '../services/api';
import ListItem from './ListItem';
import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import workModeIcon from '../assets/job-applications/work-mode.svg';
import verifiedIcon from '../assets/groups/verified.svg';
import SaveBtn from './SaveBtn';

export default function PreviewModal({ isOpen, onClose, type, item }) {
  const api = import.meta.env.VITE_API_URL;
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) {
      setFullData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        if (type === 'job') {
          const response = await getJobById(item.id);
          console.log('Job data:', response.data);
          setFullData(response.data);
        } else if (type === 'group') {
          const response = await getGroupById(item.id);
          console.log('Group data:', response.data);
          setFullData(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados para pré-visualização:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, item, type]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 backdrop-blur flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4">
          <p className="text-center">Carregando pré-visualização...</p>
        </div>
      </div>
    );
  }

  if (!fullData) {
    return (
      <div
        className="fixed inset-0 backdrop-blur flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4">
          <p className="text-center">Erro ao carregar dados</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-300 hover:brightness-95 px-4 py-2 rounded-lg font-semibold hover:cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur flex items-center justify-center z-50 overflow-y-auto p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-6xl my-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="font-bold text-lg mb-4">Como aparece na listagem</h3>
            <div className="border-2 rounded-lg p-4 bg-gray-50">
              <ListItem 
                data={fullData} 
                type={type === 'job' ? 'job_opening' : 'group'}
                isSaved={false}
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Página de detalhes</h3>
            <div className="border-2 rounded-lg overflow-hidden bg-white max-h-96 overflow-y-auto">
              {type === 'job' && (
                <div>
                  {(fullData.bannerDaVaga) && (
                    <div 
                      style={{ backgroundImage: `url('${api}${fullData.bannerDaVaga}')` }}
                      className="bg-cover bg-center bg-no-repeat w-full h-40 flex-shrink-0 mb-5 border-1"
                    ></div>
                  )}
                  <div className="px-[1rem]">
                    <div className="flex justify-between min-h-[40%] py-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="flex items-center text-lg text-nowrap text-pretty font-bold uppercase leading-none mb-1">{fullData.title}</h3>
                        <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon} />{fullData.company}</p>
                        <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon} />{fullData.city}/{fullData.uf}</p>
                        <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1px" src={workModeIcon} />{fullData.work_mode === 'Hibrido' ? 'Híbrido' : fullData.work_mode}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between min-h-full">
                        <SaveBtn active={isSaved} onClick={() => setIsSaved(!isSaved)}></SaveBtn>
                        <a href={fullData.jobLink} className="text-nowrap mt-5 bg-[#FFDF7B] py-2 px-3 rounded-md border-2 border-r-4 border-b-4 hover:cursor-pointer hover:bg-[#d1b14b] text-xs" target="_blank">Ir para a vaga</a>
                      </div>
                    </div>

                    <div className='flex flex-col py-4 gap-5'>
                      <div className='prose prose-sm max-w-none whitespace-pre-line leading-relaxed break-words overflow-wrap-anywhere text-sm'>
                        {fullData.description || ''}
                      </div>
                      {fullData.skills && fullData.skills.length > 0 && (
                        <div>
                          <h2 className='font-semibold text-lg mb-2'>Habilidades</h2>
                          <div className='flex flex-wrap gap-2'>
                            {fullData.skills.map((skill)=>(<span className='font-medium rounded-md py-1 px-1 bg-[var(--jobs-bg)] text-sm' key={skill.id}>{skill.nome}</span>))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {type === 'group' && (
                <div>
                  {(fullData.bannerDoGrupo || fullData.fotoBanner || fullData.banner) && (
                    <div 
                      style={{ backgroundImage: `url(${api}${fullData.bannerDoGrupo})` }}
                      className="bg-cover bg-center bg-no-repeat w-full h-40 flex-shrink-0 mb-5 border-1"
                    ></div>
                  )}
                  <div className='px-[1rem] relative'>
                    <div className="flex justify-between min-h-[40%] py-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg text-nowrap text-pretty font-bold uppercase leading-none">{fullData.nome}</h3>
                        <span className='flex items-center gap-1 uppercase text-[.6rem] leading-none font-semibold text-nowrap mb-2'><img src={verifiedIcon} />Espaço seguro verificado</span>
                        <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon} />{fullData.responsavel}</p>
                        <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon} />{fullData.cidade}/{fullData.estado}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between min-h-full">
                        <SaveBtn active={isSaved} onClick={() => setIsSaved(!isSaved)}></SaveBtn>
                        <a href={fullData.link} className="text-sm font-bold text-nowrap uppercase mt-5 bg-[var(--groups-bg)] py-2 px-3 rounded-lg border-2 border-r-4 border-b-4 hover:cursor-pointer hover:bg-[#d17b95]" target="_blank">quero participar</a>
                      </div>
                    </div>

                    <div className='flex flex-col py-4'>
                      <div className='prose prose-sm max-w-none whitespace-pre-line leading-relaxed break-words overflow-wrap-anywhere text-sm'>
                        {fullData.descricao || ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t-2 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:brightness-95 px-4 py-2 rounded-lg font-semibold border-2 border-r-2 border-b-2 hover:cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
