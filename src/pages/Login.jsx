import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import { useState } from "react";
import { validateEmail } from "../utils/Validation";
import { useAuth } from "../context/AuthContext";
import Feedback from "../components/Feedback";
import BackBtn from "../components/BackBtn";


export default function Login() {
  const loginFooter = (<div className="flex flex-col items-center gap-1"><Link className="underline font-medium" to={'/esqueci-a-senha'}>Esqueci minha senha</Link><p className="font-medium">Não tem conta? <Link className="font-bold underline" to={'/cadastro'}>Crie agora</Link></p></div>);

  const {login,loading} = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showFeedback,setShowFeedback] = useState(false);
  const [feedback,setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (!form.email) newErrors.email = "Email obrigatório";
    if (!(validateEmail(form.email))) newErrors.email = "Digite um email válido";
    if (!form.password) newErrors.password = "Digite sua senha";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const getLoginErrorMessage = (err) => {
      return err?.response?.data?.message || 'Não foi possível fazer login. Verifique suas credenciais e tente novamente.';
    };

    try {
      setIsSubmitting(true);
      await login(form);
      const role = (sessionStorage.getItem('role') || '').toLowerCase();
      const isPrivileged = ['administrador','moderador','rh'].includes(role);
      const redirectPath = isPrivileged ? '/admin' : '/';
      setFeedback({
        type: 'success',
        heading: 'Login realizado',
        message: 'Bem-vindo! Redirecionando...',
        duration: 2000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => { setShowFeedback(false); navigate(redirectPath); });
    } catch (err) {
      const apiMessage = getLoginErrorMessage(err);
      setFeedback({
        type: 'error',
        heading: 'Erro ao fazer login',
        message: apiMessage,
        duration: 4000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => setShowFeedback(false));
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <div className="w-full px-4 py-4">
        <BackBtn fallback="/" />
      </div>
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={'Acesse sua conta'} onSubmit={handleSubmit} requiredStyle={false} btnText={'Entrar'} btnLoadingText={'Entrando...'} loading={isSubmitting} footer={loginFooter}>
        <Field label={'Email'}
          id="login-email"
          name="email"
          type="text"
          placeholder={'exemplo@email.com'}
          error={errors.email}
          onChange={handleChange('email')} />
        <Field label={'Senha'}
          id="login-password"
          name="senha"
          type="password"
          error={errors.password}
          onChange={handleChange('password')} />
      </AuthForm>
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