import ListItem from "../components/ListItem";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import groupImage from "../assets/group.svg";
import { useEffect, useState } from "react";
import { getSupportGroups, getMyGroups } from "../services/api";
import Loading from "../components/Loading";
import Feedback from "../components/Feedback";
import SearchBar from "../components/SearchBar";

export default function SupportGroups(){
  const {isAuthenticated} = useAuth();
  const [groupList,setGroupList] = useState([]);
  const [savedGroupIds, setSavedGroupIds] = useState([]);
  const [loading,setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const showFeedback = (type, heading, message) => setFeedback({ type, heading, message });

  useEffect(()=>{
    if(isAuthenticated){
      const fetchGroups = async ()=>{
        try {
          const response = await getSupportGroups();
          console.log(response);
          const data = Array.isArray(response?.data) ? response.data : [];
          setGroupList(data);
        } catch (err) {
          console.error(err);
          showFeedback('error', 'Erro ao carregar grupos', 'Não foi possível carregar os grupos. Tente novamente.');
        } finally{
          setLoading(false);
        }
      }
      fetchGroups()
      // Carrega grupos salvos do usuário
      const fetchSavedGroups = async () => {
        try {
          const response = await getMyGroups();
          const ids = Array.isArray(response?.data) ? response.data.map(g => g.id) : [];
          setSavedGroupIds(ids);
        } catch (err) {
          console.error('Erro ao carregar grupos salvos:', err);
          showFeedback('error', 'Erro ao carregar grupos salvos', 'Não foi possível carregar seus grupos salvos. Tente novamente.');
        }
      };
      fetchSavedGroups();
    }else{
      setLoading(false)
    }
  },[isAuthenticated])

  if(loading) return <Loading/>

  return(
    <div className="flex flex-col items-center px-4 lg:px-10">
    {isAuthenticated ? 
    ( <>
        <div className='flex flex-col gap-2 mt-2 mb-5 w-[90%]'>
          <SearchBar placeholder="Pesquisar grupos..."/>
        </div>
        {groupList.map((group,index)=>(
          <ListItem key={index} data={group} type="group" isSaved={savedGroupIds.includes(group.id)} onError={showFeedback} />
        ))}
        {feedback && (
          <Feedback
            type={feedback.type}
            heading={feedback.heading}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        )}
      </>
    )
    :(
      <div className="flex flex-col items-center self-center gap-10 py-10 lg:scale-120 lg:justify-end">
        <img className="w-70"src={groupImage} alt="Ilustração de um grupo de pessoas" />
        <div className="flex flex-col items-center">
          <h1 className="font-[Nunito] font-bold text-2xl">Conexão, escuta e apoio</h1>
          <p className="max-w-60 font-medium text-sm text-center" >Entre com sua conta para acessar grupos de apoio inclusivos!</p>
        </div>
        <Link className="border-2 border-b-3 border-r-3 rounded-md bg-[var(--groups-bg)] px-4 py-3 uppercase text-sm font-bold hover:bg-[#d17b95]" to="/login">Ir para o login</Link>
      </div>
    )}
    </div>
  )
}