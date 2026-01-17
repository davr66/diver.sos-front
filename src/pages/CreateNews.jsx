import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appendNewsPhoto, createNews } from "../services/api";
import InputField from "../components/InputField";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import BackBtn from "../components/BackBtn";

export default function CreateNews(){
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [foto, setFoto] = useState(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    linkExterno: ""
  });

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

      const response = await createNews(payload);
      const newsId = response.data?.id || response.data;

      if (foto && newsId) {
        try {
          await appendNewsPhoto(newsId, foto);
        } catch (photoErr) {
          console.error('Erro ao enviar imagem da notícia', photoErr);
          // Não bloqueia o cadastro por erro na imagem
        }
      }

      navigate('/admin/noticias');
    } catch(err){
      console.error('Erro ao criar notícia', err);
      setFeedback({ type: 'error', heading: 'Erro ao criar notícia', message: err?.response?.data?.message || 'Não foi possível criar a notícia.' });
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
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-6">Cadastrar Nova Notícia</h1>
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
          {fotoPreviewUrl && (
            <img
              src={fotoPreviewUrl}
              alt="Pré-visualização da imagem"
              className="mt-2 max-h-56 w-full object-contain border-2 rounded-lg bg-white"
            />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Conteúdo</label>
          <textarea name="conteudo" value={formData.conteudo} onChange={handleChange} required rows={8} className="border-2 rounded-lg px-3 py-2 resize-none" />
        </div>
        <div className="flex gap-4 mt-4">
          <button type="submit" className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 bg-[var(--news-bg)] font-semibold hover:brightness-95">Cadastrar Notícia</button>
        </div>
      </form>
      {feedback && (<Feedback type={feedback.type} heading={feedback.heading} message={feedback.message} onClose={() => setFeedback(null)} />)}
    </div>
  );
}
