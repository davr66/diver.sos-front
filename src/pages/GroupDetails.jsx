import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGroupById } from '../services/api';
import companyIcon from '../assets/job-applications/company.svg';
import locationIcon from '../assets/job-applications/location.svg';
import verifiedIcon from '../assets/groups/verified.svg'
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
    <div className='px-[1rem] relative lg:px-40'>
      <BackButton fallback='/vagas'></BackButton>
      <div className="flex justify-between min-h-[40%] py-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg text-nowrap text-pretty font-bold uppercase leading-none">{group.nome}</h3>
          <span className='flex items-center gap-1 uppercase text-[.6rem] leading-none font-semibold text-nowrap mb-2'><img src={verifiedIcon} />Espaço seguro verificado</span>
          <p className="flex items-end gap-1 text-[12px] text-clip leading-none"><img src={companyIcon} />Coletivo 123</p>
          <p className="flex items-end gap-1 text-[12px] leading-none"><img className="pr-1" src={locationIcon} />Fortaleza/CE</p>
        </div>
        <div className="flex flex-col items-end justify-between min-h-full">
          <SaveBtn></SaveBtn>
          <a href={group.jobLink} className="text-sm font-bold text-nowrap uppercase mt-5 bg-[var(--groups-bg)] py-2 px-3 rounded-lg border-2 border-r-4 border-b-4 hover:cursor-pointer hover:bg-[#d17b95] hover:scale-104 translate-y-1" target="_blank">quero participar</a>
        </div>
      </div>

      <div className='flex flex-col py-4'>
        <p className='flex items-end gap-1 text-[12px] text-clip leading-none'>{group.description}</p>
      </div>
    </div>
  )
}