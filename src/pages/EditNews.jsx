import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appendNewsPhoto, editNews, getNewsById } from "../services/api";
import InputField from "../components/InputField";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import BackBtn from "../components/BackBtn";

export default function EditNews(){
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [foto, setFoto] = useState(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState(null);
  const [currentFotoUrl, setCurrentFotoUrl] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    linkExterno: ""
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsById(id);
        const news = response?.data;

        setFormData({
          titulo: news?.titulo || "",
          conteudo: news?.conteudo || "",
          linkExterno: news?.linkExterno || news?.link || news?.url || ""
        });

        const apiUrl = import.meta.env.VITE_API_URL;
        const fotoPath = news?.foto || news?.fotoNoticia || news?.imagem || news?.banner;
        setCurrentFotoUrl(fotoPath ? `${apiUrl}${fotoPath}` : null);
      } catch(err){
        console.error('Erro ao carregar notícia', err);
        setFeedback({ type: 'error', heading: 'Erro ao carregar', message: err?.response?.data?.message || 'Não foi possível carregar a notícia.' });
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  useEffect(() => {
    if (!foto) {
      setFotoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(foto);
    setFotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const payload = {
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        ...(formData.linkExterno ? { linkExterno: formData.linkExterno } : {})
      };

      await editNews(id, payload);

      if (foto) {
        try {
          await appendNewsPhoto(id, foto);
        } catch (photoErr) {
          console.error('Erro ao enviar imagem da notícia', photoErr);
          // Não bloqueia a edição por erro na imagem
        }
      }

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField
            label="Link externo (opcional)"
            name="linkExterno"
            type="url"
            value={formData.linkExterno}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Imagem (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
            className="border-2 rounded-lg px-3 py-2"
          />

          {(fotoPreviewUrl || currentFotoUrl) && (
            <img
              src={fotoPreviewUrl || currentFotoUrl}
              alt="Imagem da notícia"
              className="mt-2 max-h-56 w-full object-contain border-2 rounded-lg bg-white"
            />
          )}
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
