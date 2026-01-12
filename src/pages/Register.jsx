import PasswordRules from "../components/PasswordRules";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import Feedback from "../components/Feedback";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import BackBtn from "../components/BackBtn";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [passwordRules, setPasswordRules] = useState(
    checkPasswordRules("")
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const registerFooter = (<div><p className="font-medium">Já tem conta? <Link className="font-bold underline" to={'/login'}>Ir para o login.</Link></p></div>)

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      // feedback em tempo real APENAS para senha
      if (field === "password") {
        setPasswordRules(checkPasswordRules(value));
      }
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // validações básicas
    if (!form.name) newErrors.name = "Nome obrigatório";
    if (form.name.length < 3) newErrors.name = "O nome deve ter mais que 3 caracteres";
    if (!form.email) newErrors.email = "Email obrigatório";

    // validação final da senha
    const rules = checkPasswordRules(form.password);
    const isPasswordStrong = Object.values(rules).every(Boolean);

    if (!isPasswordStrong) {
      newErrors.password = "A senha não atende aos requisitos mínimos";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.name,
        email: form.email,
        senha: form.password,
        tipoDeUsuario: 'USUARIO'
      };

      await registerUser(payload);
      setRegisteredEmail(form.email);
      setShowEmailModal(true);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || 'Erro ao cadastrar usuário';
      setFeedback({
        type: 'error',
        heading: 'Erro no cadastro',
        message: errorMessage,
        duration: 4000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => setShowFeedback(false));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-screen">      <div className="w-full px-4 py-4">
        <BackBtn fallback="/" />
      </div>      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={"Crie seu perfil"} onSubmit={handleSubmit} btnText={"Cadastrar"} footer={registerFooter}>
        <Field
          label="Nome"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
          placeholder={'ex. John Doe'}
        />

        <Field
          label="Email"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
          type="email"
          placeholder={'exemplo@email.com'}
        />

        <Field
          label="Senha"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          error={errors.password}
        />

        {isPasswordFocused && (
          <PasswordRules rules={passwordRules} />
        )}

        <Field
          label="Confirmar senha"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
        />
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

      {showEmailModal && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 z-40" onClick={() => setShowEmailModal(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fce3' }}>
                <svg className="w-12 h-12" fill="#71CC47" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Cadastro realizado!</h2>
            <p className="text-gray-600 mb-2">Um email de confirmação foi enviado para:</p>
            <p className="font-semibold text-gray-800 mb-6 break-words">{registeredEmail}</p>
            <p className="text-gray-600 mb-6">Verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.</p>
            <button
              onClick={() => {
                setShowEmailModal(false);
                navigate('/login');
              }}
              className="w-full bg-[#71CC47] hover:bg-[#5ba339] border-2 border-b-3 border-r-3 px-4 py-2 rounded-md font-semibold"
            >
              Ir para o login
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

function checkPasswordRules(password) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
}