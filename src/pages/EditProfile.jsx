import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Field from "../components/Field";
import BackBtn from "../components/BackBtn";
import { getMyData, updateMyData, updateUserById, uploadProfilePhoto, getSkills } from "../services/api";
import { validateEmail } from "../utils/Validation";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Feedback from "../components/Feedback";
import SearchableSelect from "../components/SearchableSelect";
import SearchableMultiSelect from "../components/SearchableMultiSelect";

export default function EditProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    uf: "",
    pronouns: "",
    phone: "",
    birthDate: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showOther, setShowOther] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

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
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const response = await getSkills();
        const skills = Array.isArray(response.data) ? response.data.map(skill => ({
          value: skill.id,
          label: skill.nome
        })) : [];
        setSkillsOptions(skills);
      } catch (error) {
        console.error('Erro ao buscar habilidades:', error);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!form.uf) {
        setCityOptions([]);
        return;
      }
      try {
        setLoadingCities(true);
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.uf}/municipios`);
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
  }, [form.uf]);

      useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMyData();
        const user = response.data;
        setUserId(user.id ?? null);
        const cidade = user.endereco?.cidade ?? "";
        const uf = user.endereco?.estado ?? "";
        setForm({
          name: user.nome ?? "",
          email: user.email ?? "",
          city: cidade,
          uf: uf,
          pronouns: user.pronomes ?? "",
          phone: user.telefone ?? "",
          birthDate: user.dataNascimento ?? ""
        });
        // Carrega foto existente do perfil
        if (user?.fotoPerfil) {
          setPhotoPreview(`${API_URL}${user.fotoPerfil}`);
        }
        // Carrega habilidades selecionadas do usuário
        if (Array.isArray(user.habilidades)) {
          setSelectedSkills(user.habilidades.map(skill => skill.id));
        }
        // show 'outro' field only when user explicitly stored 'outro' as selection
        setShowOther(user.pronomes === 'outro');
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 403) logout();
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, []);

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handlePronounsChange(e) {
    const value = e.target.value;
    if (value === "outro") {
      setShowOther(true);
      // keep existing form.pronouns so user sees their custom value if present
    } else {
      setForm((prev) => ({ ...prev, pronouns: value }));
      setShowOther(false);
    }
  }

  function formatPhone(input) {
    const digits = input.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  }

  function handlePhoneChange(e) {
    const formatted = formatPhone(e.target.value);
    setForm((prev) => ({ ...prev, phone: formatted }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handlePhotoUpload() {
    if (!photoFile) return;
    setIsUploadingPhoto(true);
    try {
      await uploadProfilePhoto(photoFile);
      
      // Atualiza os dados do usuário para pegar a nova URL da foto
      const response = await getMyData();
      const user = response.data;
      if (user?.fotoPerfil) {
        setPhotoPreview(`${API_URL}${user.fotoPerfil}`);
      }
      
      setFeedback({
        type: 'success',
        heading: 'Foto atualizada',
        message: 'Sua foto de perfil foi atualizada com sucesso!',
        duration: 2000
      });
      setShowFeedback(true);
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || 'Não foi possível enviar a foto. Tente novamente.';
      setFeedback({
        type: 'error',
        heading: 'Erro ao enviar foto',
        message: errorMessage,
        duration: 4000
      });
      setShowFeedback(true);
      if (err?.response?.status === 403) logout();
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  async function handlePhotoDelete() {
    setIsUploadingPhoto(true);
    try {
      const payload = {
        nome: form.name,
        email: form.email,
        endereco: {
          cidade: form.city,
          estado: form.uf,
        },
        pronomes: form.pronouns,
        telefone: form.phone,
        fotoPerfil: ""
      };
      
      if (userId) {
        await updateUserById(userId, payload);
      } else {
        await updateMyData(payload);
      }
      
      setPhotoPreview(null);
      setPhotoFile(null);
      setFeedback({
        type: 'success',
        heading: 'Foto removida',
        message: 'Sua foto de perfil foi removida com sucesso!',
        duration: 2000
      });
      setShowFeedback(true);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || 'Não foi possível remover a foto. Tente novamente.';
      setFeedback({
        type: 'error',
        heading: 'Erro ao remover foto',
        message: errorMessage,
        duration: 4000
      });
      setShowFeedback(true);
      if (err?.response?.status === 403) logout();
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function handleStateChange(e) {
    const newUf = e.target.value;
    setForm((prev) => ({ ...prev, uf: newUf, city: '' }));
  }

  function handleSkillsChange(e) {
    const selectedOptions = Array.isArray(e.target.value) 
      ? e.target.value.map(v => Number(v))
      : e.target.value;
    setSelectedSkills(selectedOptions);
  }

  const pronounOptions = ["ele/dele", "ela/dela", "elu/delu","qualquer pronome"];
  const selectValue = showOther ? 'outro' : (pronounOptions.includes(form.pronouns) ? form.pronouns : '');

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!form.name) newErrors.name = "Nome obrigatório";
    if (!form.email) newErrors.email = "Email obrigatório";
    if (form.email && !validateEmail(form.email)) newErrors.email = "Email inválido";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const payload = {
        nome: form.name,
        email: form.email,
        endereco:{
          cidade: form.city,
          estado: form.uf,
        },
        pronomes: form.pronouns,
        telefone: form.phone,
        dataNascimento: form.birthDate,
        habilidades: selectedSkills.map(id => ({ id }))
      };

      if (userId) {
        const response = await updateUserById(userId, payload);
        console.log(response);
      } else {
        // fallback in case id is not available
        await updateMyData(payload);
      }
      setFeedback({
        type: 'success',
        heading: 'Perfil atualizado',
        message: 'Suas informações foram atualizadas com sucesso!',
        duration: 2000
      });
      setShowFeedback(true);
      // Mantém loading até redirecionar
      setFeedbackOnClose(() => () => { setShowFeedback(false); navigate('/perfil'); });
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Não foi possível atualizar o perfil. Tente novamente.";
      setFeedback({
        type: 'error',
        heading: 'Erro ao atualizar',
        message: errorMessage,
        duration: 4000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => setShowFeedback(false));
      // Em erro, desliga loading
      setIsSubmitting(false);
      if (err?.response?.status === 403) logout();
    }
  }

  if (fetching) return <Loading />;

  return (
    <div className="flex flex-col items-center bg-[var(--general-bg)] min-h-screen px-5">
      <div className="w-full max-w-[45rem] mt-6">
        <BackBtn fallback="/perfil"/>
      </div>

      <FormContainer heading={"Editar perfil"} onSubmit={handleSubmit} btnText={"Salvar"} btnLoadingText={"Salvando..."} loading={isSubmitting} bordered={false}>
        <div className="flex flex-col gap-3 w-full mb-4 items-center">
          <label className="font-semibold">Foto de perfil</label>
          <div 
            className="w-40 h-40 rounded-full border-3 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: photoPreview 
                ? `url('${photoPreview}')`
                : "url('../src/assets/profile-placeholder.png')"
            }}
          >
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="border-2 rounded-lg py-2 px-2 max-w-xs"
          />
          {photoFile && (
            <button
              type="button"
              onClick={handlePhotoUpload}
              disabled={isUploadingPhoto}
              className="bg-[#71CC47] hover:bg-[#5ba339] border-2 border-b-3 border-r-3 px-4 py-2 rounded-md font-semibold disabled:brightness-90"
            >
              {isUploadingPhoto ? 'Enviando...' : 'Enviar foto'}
            </button>
          )}
        </div>

        <Field label="Nome" value={form.name} onChange={handleChange("name")} error={errors.name} placeholder={'ex. John Doe'} />

        <Field label="Email" value={form.email} onChange={handleChange("email")} error={errors.email} type="email" placeholder={'exemplo@email.com'} />

        <div className="flex flex-col gap-1 w-full">
          <label className="font-semibold">Pronomes</label>
          <select className="border-2 rounded-lg py-2 pl-2" value={selectValue} onChange={handlePronounsChange}>
            <option value="">Selecione</option>
            <option value="ele/dele">ele/dele</option>
            <option value="ela/dela">ela/dela</option>
            <option value="elu/delu">elu/delu</option>
            <option value="qualquer pronome">qualquer pronome</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {showOther && (
          <Field label="Pronomes (outro)" value={form.pronouns} onChange={handleChange("pronouns")} placeholder={'ex. they/them'} required={false} />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          <SearchableSelect
            label="Estado"
            value={form.uf}
            onChange={handleStateChange}
            options={stateOptions}
            disabled={loadingStates}
            placeholder="Selecione"
          />
          <SearchableSelect
            label="Cidade"
            value={form.city}
            onChange={handleChange("city")}
            options={cityOptions}
            disabled={!form.uf || loadingCities}
            placeholder={!form.uf ? 'Selecione um estado primeiro' : 'Selecione'}
          />
        </div>

        <SearchableMultiSelect
          label="Habilidades"
          value={selectedSkills}
          onChange={handleSkillsChange}
          options={skillsOptions}
          disabled={loadingSkills}
          placeholder="Buscar e selecionar habilidades"
        />

        <Field label="Data de nascimento" value={form.birthDate} onChange={handleChange("birthDate")} type="date" required={false} />

        <Field label="Telefone" value={form.phone} onChange={handlePhoneChange} placeholder={'(xx) xxxxx-xxxx'} required={false} type="tel" maxLength={15} />
      </FormContainer>

      {showFeedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          duration={feedback.duration || 3000}
          onClose={feedbackOnClose}
        />
      )}
    </div>
  );
}
