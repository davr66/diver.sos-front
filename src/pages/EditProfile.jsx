import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Field from "../components/Field";
import BackBtn from "../components/BackBtn";
import { getMyData, updateMyData, updateUserById } from "../services/api";
import { validateEmail } from "../utils/Validation";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(null);
  const [showOther, setShowOther] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMyData();
        const user = response.data;
        setUserId(user.id ?? null);
        setForm({
          name: user.nome ?? "",
          email: user.email ?? "",
          city: user.endereco?.cidade ?? "",
          uf: user.endereco?.estado ?? "",
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

    setLoading(true);

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
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => navigate("/perfil"), 1300);
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: "Erro ao atualizar perfil" });
      }
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

      <FormContainer heading={"Editar perfil"} onSubmit={handleSubmit} btnText={loading ? "Salvando..." : "Salvar"} bordered={false}>
        {errors.api && <div className="text-sm text-red-500">{errors.api}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

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
          <Field label="Cidade" value={form.city} onChange={handleChange("city")} placeholder={'Cidade'} />
          <Field label="UF" value={form.uf} onChange={handleChange("uf")} placeholder={'UF'} />
        </div>

        <Field label="Telefone" value={form.phone} onChange={handlePhoneChange} placeholder={'(xx) xxxxx-xxxx'} required={false} type="tel" maxLength={15} />
      </FormContainer>
    </div>
  );
}
