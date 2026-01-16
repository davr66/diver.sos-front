import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/InputField";
import SearchableSelect from "../components/SearchableSelect";
import SearchableMultiSelect from "../components/SearchableMultiSelect";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import BackBtn from "../components/BackBtn";
import { getUserById, updateUserById, getSkills } from "../services/api";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    pronomes: "",
    cidade: "",
    estado: "",
    tipoDeUsuario: "USUARIO",
    status: "HABILITADO",
    habilidades: []
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const data = await response.json();
        const states = data.sort((a, b) => a.nome.localeCompare(b.nome)).map(state => ({
          value: state.sigla,
          label: state.nome
        }));
        setStateOptions(states);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();
        const skills = Array.isArray(response.data) ? response.data.map(skill => ({
          value: skill.id,
          label: skill.nome
        })) : [];
        setSkillsOptions(skills);
      } catch (error) {
        console.error('Erro ao buscar habilidades:', error);
      }
    };
    fetchSkills();
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
        const cities = data.sort((a, b) => a.nome.localeCompare(b.nome)).map(city => ({
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
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        const user = response.data;
        setFormData({
          nome: user.nome || "",
          email: user.email || "",
          telefone: user.telefone || "",
          dataNascimento: user.dataNascimento || "",
          pronomes: user.pronomes || "",
          cidade: user.endereco?.cidade || "",
          estado: user.endereco?.estado || "",
          tipoDeUsuario: user.tipoDeUsuario || "USUARIO",
          status: user.status || "HABILITADO",
          habilidades: Array.isArray(user.habilidades) ? user.habilidades.map(h => h.id) : []
        });
      } catch (err) {
        console.error('Erro ao carregar usuário', err);
        setFeedback({ type: 'error', heading: 'Erro ao carregar', message: err?.response?.data?.message || 'Não foi possível carregar o usuário.' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (event) => {
    const value = event?.target?.value || "";
    setFormData(prev => ({ ...prev, estado: value, cidade: "" }));
  };

  const handleCityChange = (event) => {
    const value = event?.target?.value || "";
    setFormData(prev => ({ ...prev, cidade: value }));
  };

  const handleSkillsChange = (event) => {
    const value = event?.target?.value || [];
    setFormData(prev => ({ ...prev, habilidades: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const habilidades = (Array.isArray(formData.habilidades) ? formData.habilidades : [])
        .map((h) => {
          if (h && typeof h === "object") return { id: h.id };
          const numericId = Number(h);
          return { id: Number.isFinite(numericId) ? numericId : h };
        })
        .filter((h) => h.id !== undefined && h.id !== null && h.id !== "");

      const payload = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        pronomes: formData.pronomes,
        endereco: {
          cidade: formData.cidade,
          estado: formData.estado
        },
        tipoDeUsuario: formData.tipoDeUsuario,
        status: formData.status,
        habilidades
      };
      await updateUserById(id, payload);
      navigate('/admin/gerenciar-usuarios');
    } catch (err) {
      console.error('Erro ao editar usuário', err);
      setFeedback({ type: 'error', heading: 'Erro ao editar usuário', message: err?.response?.data?.message || 'Não foi possível editar o usuário.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <div className="w-full max-w-4xl mb-6">
        <BackBtn fallback="/admin/gerenciar-usuarios" />
      </div>
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-6">Editar Usuário</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
          <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField label="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
          <InputField label="Data de Nascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputField label="Data de Nascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} />
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Pronomes</label>
            <select name="pronomes" value={formData.pronomes} onChange={handleChange} className="border-2 rounded-lg px-3 py-2 h-[42px]">
              <option value="">Selecione</option>
              <option value="ele/dele">Ele/Dele</option>
              <option value="ela/dela">Ela/Dela</option>
              <option value="elu/delu">Elu/Delu</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SearchableSelect
            label="Estado"
            options={stateOptions}
            value={stateOptions.find(opt => opt.value === formData.estado)}
            onChange={handleStateChange}
            placeholder="Selecione o estado"
          />
          <SearchableSelect
            label="Cidade"
            options={cityOptions}
            value={cityOptions.find(opt => opt.value === formData.cidade)}
            onChange={handleCityChange}
            placeholder="Selecione a cidade"
            isDisabled={!formData.estado || loadingCities}
            isLoading={loadingCities}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Tipo de Usuário</label>
            <select name="tipoDeUsuario" value={formData.tipoDeUsuario} onChange={handleChange} className="border-2 rounded-lg px-3 py-2 h-[42px]">
              <option value="USUARIO">Usuário</option>
              <option value="MODERADOR">Moderador</option>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="RH">RH</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="border-2 rounded-lg px-3 py-2 h-[42px]">
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>
        </div>
        <SearchableMultiSelect
          label="Habilidades"
          options={skillsOptions}
          value={formData.habilidades}
          onChange={handleSkillsChange}
          placeholder="Selecione as habilidades"
        />
        <div className="flex gap-4 mt-4">
          <button type="submit" className="flex-1 border-2 border-b-3 border-r-3 rounded-lg py-2 bg-[var(--profile-bg)] font-semibold hover:brightness-95">Salvar Alterações</button>
        </div>
      </form>
      {feedback && (<Feedback type={feedback.type} heading={feedback.heading} message={feedback.message} onClose={() => setFeedback(null)} />)}
    </div>
  );
}
