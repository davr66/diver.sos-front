import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import { validateEmail } from "../utils/Validation";
import { useState } from "react";


export default function ForgotPassword() {
  const passFooter = (<Link className="underline font-medium" to={'/login'}>Voltar para o login</Link>);
  const [form, setForm] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // validações básicas
    if (!form.email) newErrors.email = "Email obrigatório";
    if (!(validateEmail(form.email))) newErrors.email = "Digite um email válido";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log(form,errors)
      return;
    }


    console.log("Envio válido:", form);
  }

  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={'Recuperar senha'} onSubmit={handleSubmit} requiredStyle={false} btnText={'Enviar'} footer={passFooter}>
        <p className="text-sm">Informe seu endereço de email que nós enviaremos um link para a redefinição de senha.</p>
        <Field label={'Email'}
          type="email"
          placeholder={'exemplo@email.com'}
          onChange={handleChange('email')}
          error={errors.email} />
      </AuthForm>
    </div>
  );
}