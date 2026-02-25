import ListItem from "../components/ListItem";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import groupImage from "../assets/group.svg";
import { useEffect, useState } from "react";
import { getSupportGroups, getMyGroups } from "../services/api";
import Loading from "../components/Loading";
import Feedback from "../components/Feedback";
import SearchBar from "../components/SearchBar";
import CascadingFilter from "../components/CascadingFilter";

export default function SupportGroups(){
  const {isAuthenticated} = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [groupList,setGroupList] = useState([]);
  const [savedGroupIds, setSavedGroupIds] = useState([]);
  const [loading,setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState(searchParams.get('q') || "");
  const [selectedState, setSelectedState] = useState(() => {
    const v = searchParams.get('uf');
    return v ? [v] : [];
  });
  const [selectedCities, setSelectedCities] = useState(() => {
    const v = searchParams.get('cidades');
    return v ? v.split(',').filter(Boolean) : [];
  });
  const showFeedback = (type, heading, message) => setFeedback({ type, heading, message });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (selectedState.length > 0) params.set('uf', selectedState[0]);
    if (selectedCities.length > 0) params.set('cidades', selectedCities.join(','));
    setSearchParams(params, { replace: true });
  }, [search, selectedState, selectedCities, setSearchParams]);

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

  const normalize = (str) => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const filteredGroups = groupList.filter(group => {
    if (search.trim()) {
      const term = normalize(search);
      const nome = normalize(group.nome);
      const descricao = normalize(group.descricao);
      const categoria = normalize(group.categoria);
      if (!nome.includes(term) && !descricao.includes(term) && !categoria.includes(term)) {
        return false;
      }
    }
    if (selectedState.length > 0 && !selectedState.includes(normalize(group.estado))) {
      return false;
    }
    if (selectedCities.length > 0 && !selectedCities.includes(normalize(group.cidade))) {
      return false;
    }
    return true;
  });

  if(loading) return <Loading/>

  return(
    <div className="flex flex-col px-4 lg:px-10 pt-5">
    {isAuthenticated ? 
    ( <>
        <div className='flex flex-col gap-2 mt-2 mb-5'>
          <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar grupos..."/>
          <CascadingFilter
            onStateChange={setSelectedState}
            onCityChange={setSelectedCities}
            buttonColor="#FFA3BE"
            initialState={selectedState}
            initialCities={selectedCities}
          />
        </div>
        {filteredGroups.map((group,index)=>(
          <ListItem key={index} data={group} type="group" isSaved={savedGroupIds.includes(group.id)} onError={showFeedback} />
        ))}
        {search.trim() !== "" && filteredGroups.length === 0 && (
          <p>Nenhum grupo encontrado</p>
        )}
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