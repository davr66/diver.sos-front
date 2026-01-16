import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import Feedback from "../components/Feedback";
import BackBtn from "../components/BackBtn";
import { setNewPassword } from "../services/api";

export default function NewPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => {
    return searchParams.get("token") || searchParams.get("t") || "";
  }, [searchParams]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, []);

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value
      }));
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.password) newErrors.password = "Digite uma senha";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirme sua senha";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      await setNewPassword(token, form.password, form.confirmPassword);

      setFeedback({
        type: "success",
        heading: "Senha atualizada!",
        message: "Sua senha foi alterada com sucesso. Redirecionando para o login...",
        duration: 2000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => {
        setShowFeedback(false);
        navigate("/login");
      });

      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setFeedback({
        type: "error",
        heading: "Erro ao redefinir senha",
        message: err?.response?.data?.message || "Não foi possível redefinir sua senha. Tente novamente.",
        duration: 4000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => setShowFeedback(false));
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex flex-col items-center gap-1">
      <Link className="underline font-medium" to={"/login"}>
        Voltar para o login
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <div className="w-full px-4 py-4">
        <BackBtn fallback="/login" />
      </div>

      <img
        className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3"
        src="./src/assets/logo.svg"
        alt="Logo da diver.sos"
      />

      <AuthForm
        heading={"Definir nova senha"}
        onSubmit={handleSubmit}
        requiredStyle={false}
        btnText={"Salvar"}
        btnLoadingText={"Salvando..."}
        loading={isSubmitting}
        footer={footer}
      >
        <Field
          label={"Senha"}
          id="new-password"
          name="senha"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={handleChange("password")}
        />

        <Field
          label={"Confirmar senha"}
          id="new-password-confirm"
          name="confirmarSenha"
          type="password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange("confirmPassword")}
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
    </div>
  );
}
