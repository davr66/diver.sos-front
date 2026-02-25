import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editGroup, appendGroupBanner, getGroupById } from "../services/api";
import InputField from "../components/InputField";
import SearchableSelect from "../components/SearchableSelect";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";import BackBtn from "../components/BackBtn";
export default function EditGroup() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    link: "",
    cidade: "",
    estado: "",
    responsavel: ""
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const data = await response.json();
        const states = data.sort((a,b) => a.nome.localeCompare(b.nome)).map(s => ({ value: s.sigla, label: s.nome }));
        setStateOptions(states);
      } catch (e) { console.error(e); } finally { setLoadingStates(false); }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.estado) { setCityOptions([]); return; }
      try {
        setLoadingCities(true);
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios`);
        const data = await response.json();
        const cities = data.sort((a,b) => a.nome.localeCompare(b.nome)).map(c => ({ value: c.nome, label: c.nome }));
        setCityOptions(cities);
      } catch (e) { console.error(e); setCityOptions([]);} finally { setLoadingCities(false); }
    };
    fetchCities();
  }, [formData.estado]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await getGroupById(id);
        const g = response.data;
        setFormData({
          nome: g.nome || g.name || "",
          categoria: g.categoria || g.category || "",
          descricao: g.descricao || g.description || "",
          link: g.link || g.url || "",
          cidade: g.cidade || g.city || "",
          estado: g.estado || g.uf || "",
          responsavel: g.responsavel || g.owner || ""
        });
      } catch (err) {
        console.error("Erro ao carregar grupo", err);
        setFeedback({ type: 'error', heading: 'Erro ao carregar', message: 'Não foi possível carregar o grupo.' });
      } finally { setLoading(false); }
    };
    if (id) fetchGroup();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleStateChange = (e) => {
    const newEstado = e.target.value;
    setFormData(prev => ({ ...prev, estado: newEstado, cidade: '' }));
  };
  const handleCityChange = (e) => {
    setFormData(prev => ({ ...prev, cidade: e.target.value }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: "error",
          heading: "Arquivo muito grande",
          message: "O banner deve ter no máximo 5MB."
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFeedback({
          type: "error",
          heading: "Formato inválido",
          message: "O banner deve ser uma imagem."
        });
        return;
      }
      setBannerFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await editGroup(id, formData);

      if (bannerFile) {
        try {
          await appendGroupBanner(id, bannerFile);
        } catch (bannerErr) {
          console.error("Erro ao enviar banner", bannerErr);
        }
      }

      navigate('/admin/grupos');
    } catch (err) {
      console.error('Erro ao editar grupo', err);
      setFeedback({ type: 'error', heading: 'Erro ao editar grupo', message: err?.response?.data?.message || 'Não foi possível editar o grupo.' });
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loading/>;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <div className="w-full max-w-4xl mb-6">
        <BackBtn fallback="/admin/grupos" />
      </div>
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-6">Editar Grupo</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
          <InputField label="Responsável" name="responsavel" value={formData.responsavel} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField label="Categoria" name="categoria" value={formData.categoria} onChange={handleChange} required />
          <InputField label="Link" name="link" type="url" value={formData.link} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SearchableSelect label="Estado" value={formData.estado} onChange={handleStateChange} options={stateOptions} disabled={loadingStates} placeholder="Selecione" />
          <SearchableSelect label="Cidade" value={formData.cidade} onChange={handleCityChange} options={cityOptions} disabled={!formData.estado || loadingCities} placeholder={!formData.estado ? 'Selecione um estado primeiro' : 'Selecione'} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Descrição</label>
          <textarea name="descricao" value={formData.descricao} onChange={handleChange} required rows={5} className="border-2 rounded-lg px-3 py-2 resize-none" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Atualizar Banner do Grupo (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="border-2 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--groups-bg)] file:font-semibold file:cursor-pointer hover:file:brightness-95"
          />
          {bannerFile && (
            <span className="text-sm text-gray-600 mt-1">
              Arquivo selecionado: {bannerFile.name}
            </span>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button type="button" onClick={() => navigate('/admin/grupos')} className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 font-semibold hover:brightness-95" disabled={submitting}>Cancelar</button>
          <button type="submit" className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 bg-[var(--groups-bg)] font-semibold hover:brightness-95 disabled:opacity-60" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar Alterações'}</button>
        </div>
      </form>
      {feedback && (<Feedback type={feedback.type} heading={feedback.heading} message={feedback.message} onClose={() => setFeedback(null)} />)}
    </div>
  );
}
