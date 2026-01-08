import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGroupById } from '../services/api';
import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import workModeIcon from '../assets/job-applications/work-mode.svg';
import BackButton from '../components/BackBtn';
import SaveBtn from '../components/SaveBtn';
import Loading from '../components/Loading';

export default function JobDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    getGroupById(id).then(res => setGroup(res.data));
  }, [id]);
  console.log(group);

  if (!group) return <Loading/>;

  return (
    <div className='px-[1rem] relative'>
      <BackButton fallback='/vagas'></BackButton>
      <div className="flex justify-between min-h-[40%] py-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg text-nowrap text-pretty font-bold uppercase leading-none mb-1">{group.nome}</h3>
          
        </div>
        <div className="flex flex-col items-end justify-between min-h-full">
          <SaveBtn></SaveBtn>
          <a href={group.jobLink} className="text-nowrap mt-5 bg-[var(--groups-bg)] py-2 px-3 rounded-md border-2 border-r-4 border-b-4 hover:cursor-pointer hover:bg-[#d1b14b]" target="_blank">Ir para a vaga</a>
        </div>
      </div>

      <div className='flex flex-col py-4'>
        <p className='flex items-end gap-1 text-[12px] text-clip leading-none'>{group.description}</p>
      </div>
    </div>
  )
}