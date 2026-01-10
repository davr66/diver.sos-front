import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Field from "../components/Field";
import BackBtn from "../components/BackBtn";
import { getMyData, updateMyData, updateUserById } from "../services/api";
import { validateEmail } from "../utils/Validation";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Feedback from "../components/Feedback";
import SearchableSelect from "../components/SearchableSelect";

export default function EditProfile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    uf: "",
    pronouns: "",
    phone: ""
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

  // Fetch states from IBGE API on mount
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

  // Fetch cities when state changes
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
          phone: user.telefone ?? ""
        });
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

  function handleStateChange(e) {
    const newUf = e.target.value;
    setForm((prev) => ({ ...prev, uf: newUf, city: '' }));
  }

  const pronounOptions = ["ele/dele", "ela/dela", "elu/delu"];
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
        telefone: form.phone
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
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <Loading />;

  return (
    <div className="flex flex-col items-center bg-[var(--general-bg)] min-h-screen px-5">
      <div className="w-full max-w-[45rem] mt-6">
        <BackBtn />
      </div>

      <FormContainer heading={"Editar perfil"} onSubmit={handleSubmit} btnText={"Salvar"} btnLoadingText={"Salvando..."} loading={isSubmitting} bordered={false}>
        <Field label="Nome" value={form.name} onChange={handleChange("name")} error={errors.name} placeholder={'ex. John Doe'} />

        <Field label="Email" value={form.email} onChange={handleChange("email")} error={errors.email} type="email" placeholder={'exemplo@email.com'} />

        <div className="flex flex-col gap-1 w-full">
          <label className="font-semibold">Pronomes</label>
          <select className="border-2 rounded-lg py-2 pl-2" value={selectValue} onChange={handlePronounsChange}>
            <option value="">Selecione</option>
            <option value="ele/dele">ele/dele</option>
            <option value="ela/dela">ela/dela</option>
            <option value="elu/delu">elu/delu</option>
            <option value="elu/delu">qualquer pronome</option>
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
