import { useEffect, useState } from "react";
import ListItem from "../components/ListItem";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import favoritesImg from "../assets/favorites.svg";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import { getMyFavoriteJobs, getMyGroups } from "../services/api";

export default function Favorites(){
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'jobs', 'groups'
  const showFeedback = (type, heading, message) => setFeedback({ type, heading, message });

  const filteredItems = items.filter(item => {
    if (filterType === 'jobs' && item.type !== 'job_opening') return false;
    if (filterType === 'groups' && item.type !== 'group') return false;
    return true;
  });


  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const [jobsRes, groupsRes] = await Promise.all([
          getMyFavoriteJobs(),
          getMyGroups()
        ]);

        const jobs = Array.isArray(jobsRes?.data) ? jobsRes.data : [];
        const groups = Array.isArray(groupsRes?.data) ? groupsRes.data : [];

        const unified = [
          ...jobs.map(j => ({ type: 'job_opening', data: j })),
          ...groups.map(g => ({ type: 'group', data: g }))
        ];

        setItems(unified);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        showFeedback('error', 'Erro ao carregar favoritos', 'Não foi possível carregar seus favoritos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col px-4 lg:px-10">
      {isAuthenticated ? (
        <>
          <div className='flex self-start gap-2 mt-4 mb-5'>
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1 rounded-full border-2 font-bold text-sm transition-all ${
                filterType === 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:ring-1 hover:ring-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('jobs')}
              className={`px-4 rounded-full border-2 font-bold text-sm transition-all ${
                filterType === 'jobs'
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:ring-1 hover:ring-gray-300'
              }`}
            >
              Vagas
            </button>
            <button
              onClick={() => setFilterType('groups')}
              className={`px-4 py-1 rounded-full border-2 font-bold text-sm transition-all ${
                filterType === 'groups'
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:ring-1 hover:ring-gray-300'
              }`}
            >
              Grupos
            </button>
          </div>
          <div className='flex flex-col items-center'>
            {items.length === 0 && (
              <p className="mt-4">Você ainda não tem favoritos.</p>
            )}
            {filteredItems.length === 0 && items.length > 0 && (
              <p className="mt-4">Nenhum item encontrado com os filtros selecionados.</p>
            )}
            {filteredItems.map((item, index) => (
              <ListItem key={index} data={item.data} type={item.type} isSaved={true} onError={showFeedback} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center self-center gap-10 lg:scale-120 lg:justify-end">
          <img className="w-70" src={favoritesImg} alt="Ilustração de uma mulher usando um computador" />
          <div className="flex flex-col items-center">
            <h1 className="font-[Nunito] font-bold text-2xl">Seus favoritos ficam aqui</h1>
            <p className="max-w-60 font-medium text-sm text-center">Entre com sua conta para salvar vagas e grupos de apoio para ver depois!</p>
          </div>
          <Link className="border-2 border-b-3 border-r-3 rounded-md bg-[var(--favorites-bg)] px-4 py-3 uppercase text-sm font-bold hover:bg-[#cc2121]" to="/login">Ir para o login</Link>
        </div>
      )}

      {feedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
}