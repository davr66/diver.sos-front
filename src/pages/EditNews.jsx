import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editNews, getNewsById } from "../services/api";
import InputField from "../components/InputField";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import BackBtn from "../components/BackBtn";

export default function EditNews(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: ""
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsById(id);
        setFormData({ titulo: data.titulo || "", conteudo: data.conteudo || "" });
      } catch(err){
        console.error('Erro ao carregar notícia', err);
        setFeedback({ type: 'error', heading: 'Erro ao carregar', message: err?.response?.data?.message || 'Não foi possível carregar a notícia.' });
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      await editNews(id, formData);
      navigate('/admin/noticias');
    } catch(err){
      console.error('Erro ao editar notícia', err);
      setFeedback({ type: 'error', heading: 'Erro ao editar notícia', message: err?.response?.data?.message || 'Não foi possível editar a notícia.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading/>;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <div className="w-full max-w-4xl mb-6">
        <BackBtn fallback="/admin/noticias" />
      </div>
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-6">Editar Notícia</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField label="Título" name="titulo" value={formData.titulo} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Conteúdo</label>
          <textarea name="conteudo" value={formData.conteudo} onChange={handleChange} required rows={8} className="border-2 rounded-lg px-3 py-2 resize-none" />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 bg-[var(--news-bg)] font-semibold hover:brightness-95">Salvar Alterações</button>
        </div>
      </form>
      {feedback && (<Feedback type={feedback.type} heading={feedback.heading} message={feedback.message} onClose={() => setFeedback(null)} />)}
    </div>
  );
}
