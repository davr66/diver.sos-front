import React from "react";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button";
import { useForm } from "../hooks/useForm";
import { validateEmail, validateRequired } from "../utils/Validation";

export default function ForgotPasswordPage({ onNavigate }) {
  const {
    values,
    error,
    success,
    loading,
    setError,
    setSuccess,
    setLoading,
    handleChange,
  } = useForm({
    email: "",
  });

  const handleSubmit = () => {
    setError("");
    setSuccess("");

    const requiredError = validateRequired(values);
    if (requiredError) {
      setError(requiredError);
      return;
    }

    if (!validateEmail(values.email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSuccess("Instruções de recuperação enviadas para seu email!");
      setLoading(false);
      setTimeout(() => onNavigate("login"), 2000);
    }, 1500);
  };

  return (
    <AuthLayout error={error} success={success}>
      <h1 className="text-2xl font-bold text-gray-900 text-center mt-4">
        Recuperar Senha
      </h1>
      <p className="text-sm semibold text-black text-center mt-4 mb-4">
        Digite seu email para receber instruções de recuperação
      </p>

      <div className="m-4">
        <InputField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          placeholder="Digite seu email"
          icon={Mail}
          disabled={loading}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <div className="mt-8">
          <Button onClick= {handleSubmit} loading={loading} className = "">
            Enviar instruções
          </Button>
        </div>

        <div className="text-center m-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("login");
            }}
            className="text-sm font-medium text-black underline hover:text-[#6FC847] hover:underline"
          >
            Voltar para o login
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
