import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editJobOpening, appendJobBanner, getJobById, getSkills } from "../services/api";
import InputField from "../components/InputField";
import SearchableMultiSelect from "../components/SearchableMultiSelect";
import SearchableSelect from "../components/SearchableSelect";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import BackBtn from "../components/BackBtn";
import { useAuth } from "../context/AuthContext";

export default function EditJob() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [skills, setSkills] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    empresa: "",
    linkDaVaga: "",
    cidade: "",
    estado: "",
    dataLimite: "",
    status: "ATIVA",
    tipo: "AFIRMATIVA",
    modalidade: "PRESENCIAL",
    habilidades: []
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const data = await response.json();
        const states = data
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .map(state => ({
            value: state.sigla,
            label: state.nome
          }));
        setStateOptions(states);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.estado) {
        setCityOptions([]);
        return;
      }
      try {
        setLoadingCities(true);
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios`);
        const data = await response.json();
        const cities = data
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .map(city => ({
            value: city.nome,
            label: city.nome
          }));
        setCityOptions(cities);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.estado]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();
        setSkills(response.data || []);
      } catch (err) {
        console.error("Erro ao carregar habilidades", err);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        const job = response.data;
        
        let dateOnly = "";
        if (job.deadline) {
          const date = new Date(job.deadline);
          dateOnly = date.toISOString().split('T')[0];
        }

        setFormData({
          titulo: job.title || "",
          descricao: job.description || "",
          empresa: job.company || "",
          linkDaVaga: job.jobLink || "",
          cidade: job.city || "",
          estado: job.uf || "",
          dataLimite: dateOnly,
          status: job.status || "ATIVA",
          tipo: job.type || "AFIRMATIVA",
          modalidade: job.work_mode?.toUpperCase() || "PRESENCIAL",
          habilidades: Array.isArray(job.skills) ? job.skills.map(s => String(s.id)) : []
        });
      } catch (err) {
        console.error("Erro ao carregar vaga", err);
        setFeedback({
          type: "error",
          heading: "Erro ao carregar",
          message: "Não foi possível carregar os dados da vaga. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setFormData(prev => ({ ...prev, habilidades: e.target.value }));
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
      const payload = {
        ...formData,
        dataLimite: formData.dataLimite ? `${formData.dataLimite}T23:59:59` : "",
        habilidades: formData.habilidades.map(id => ({ id: Number(id) }))
      };
      
      await editJobOpening(id, payload);

      if (bannerFile) {
        try {
          await appendJobBanner(id, bannerFile);
        } catch (bannerErr) {
          console.error("Erro ao enviar banner", bannerErr);
        }
      }

      navigate("/admin/vagas");
    } catch (err) {
      console.error("Erro ao editar vaga", err);
      setFeedback({
        type: "error",
        heading: "Erro ao editar vaga",
        message: err?.response?.data?.message || "Não foi possível editar a vaga. Tente novamente."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const skillOptions = skills.map(skill => ({
    value: String(skill.id),
    label: skill.nome || skill.name || skill.label
  }));

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <div className="w-full max-w-4xl mb-6">
        <BackBtn fallback="/admin/vagas" />
      </div>
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-6">Editar Vaga</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField
            label="Título da Vaga"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
          <InputField
            label="Empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Modalidade</label>
            <select
              name="modalidade"
              value={formData.modalidade}
              onChange={handleChange}
              required
              className="border-2 rounded-lg px-3 py-2 h-[42px]"
            >
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>
          <InputField
            label="Data Limite"
            name="dataLimite"
            type="date"
            value={formData.dataLimite}
            onChange={handleChange}
            required
          />
          <InputField
            label="Link da Vaga"
            name="linkDaVaga"
            type="url"
            value={formData.linkDaVaga}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SearchableSelect
            label="Estado"
            value={formData.estado}
            onChange={handleStateChange}
            options={stateOptions}
            disabled={loadingStates}
            placeholder="Selecione"
          />
          <SearchableSelect
            label="Cidade"
            value={formData.cidade}
            onChange={handleCityChange}
            options={cityOptions}
            disabled={!formData.estado || loadingCities}
            placeholder={!formData.estado ? 'Selecione um estado primeiro' : 'Selecione'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {user.role !== "RH" &&(
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="border-2 rounded-lg px-3 py-2 h-[42px]"
            >
              <option value="ATIVA">Ativa</option>
              <option value="PREENCHIDA">Preenchida</option>
              <option value="INATIVA">Inativa</option>
            </select>
          </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="border-2 rounded-lg px-3 py-2 h-[42px]"
            >
              <option value="AFIRMATIVA">Afirmativa</option>
              <option value="EDITAL">Edital</option>
              <option value="NAO_AFIRMATIVA">Não Afirmativa</option>
              <option value="NAO_EDITAL">Não Edital</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Digite a descrição da vaga..."
            rows={10}
            className="border-2 rounded-lg px-3 py-2 font-sans text-sm resize-y min-h-[200px] focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <SearchableMultiSelect
          label="Habilidades"
          value={formData.habilidades}
          onChange={handleSkillsChange}
          options={skillOptions}
          placeholder="Selecione as habilidades"
        />

        <div className="flex flex-col gap-1">
          <label className="font-semibold">Atualizar Banner da Vaga (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="border-2 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[var(--jobs-bg)] file:font-semibold file:cursor-pointer hover:file:brightness-95"
          />
          {bannerFile && (
            <span className="text-sm text-gray-600 mt-1">
              Arquivo selecionado: {bannerFile.name}
            </span>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/vagas")}
            className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 font-semibold hover:brightness-95"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 bg-[var(--jobs-bg)] font-semibold hover:brightness-95 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>

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
