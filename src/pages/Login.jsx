import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import { useState } from "react";
import { validateEmail } from "../utils/Validation";
import { useAuth } from "../context/AuthContext";


export default function Login() {
  const loginFooter = (<div className="flex flex-col items-center gap-1"><Link className="underline font-medium" to={'/esqueci-a-senha'}>Esqueci minha senha</Link><p className="font-medium">Não tem conta? <Link className="font-bold underline" to={'/cadastro'}>Crie agora</Link></p></div>);

  const {login,loading} = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // validações básicas
    if (!form.email) newErrors.email = "Email obrigatório";
    if (!(validateEmail(form.email))) newErrors.email = "Digite um email válido";
    if (!form.password) newErrors.password = "Digite sua senha"

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log(form,errors)
      return;
    }

    try{
      await login(form);
      navigate('/');
    }catch(err){
      setErrors("response",err)
    }

    console.log("Login válido:", form);
  }
  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={'Acesse sua conta'} onSubmit={handleSubmit} requiredStyle={false} btnText={'Entrar'} footer={loginFooter}>
        <Field label={'Email'}
          type="text"
          placeholder={'exemplo@email.com'}
          error={errors.email}
          onChange={handleChange('email')} />
        <Field label={'Senha'}
          type="password"
          error={errors.password}
          onChange={handleChange('password')} />
      </AuthForm>
    </div>
  );
}