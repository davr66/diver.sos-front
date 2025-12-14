import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button";
import { useForm } from "../hooks/useForm";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../utils/Validation";

export default function RegisterPage({ onNavigate }) {
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
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const passwordError = validatePassword(values.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSuccess("Conta criada com sucesso! Faça login para continuar.");
      setLoading(false);
      setTimeout(() => onNavigate("login"), 2000);
    }, 1500);
  };

  return (
    <AuthLayout error={error} success={success}>
      <h1 className="text-2xl font-bold text-gray-900 text-center my-4  ">
        Criar Conta
      </h1>

      <div className="space-y-4 mx-4">
        <InputField
          label="E-mail"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          placeholder="Digite seu email"
          icon={Mail}
          disabled={loading}
        />

        <InputField
          label="Senha"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onChange={handleChange("password")}
          placeholder="Mínimo 6 caracteres"
          icon={Lock}
          disabled={loading}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        <InputField
          label="Confirmar Senha"
          type={showConfirmPassword ? "text" : "password"}
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          placeholder="Digite a senha novamente"
          icon={Lock}
          disabled={loading}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />
        <div className="mt-8">
          <Button onClick={handleSubmit} loading={loading}>
            Criar conta
          </Button>
        </div>

        <p className="text-center text-1xl text-black underline hover:text-[#6FC847] my-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("login");
            }}
            className="font-medium text-black hover:text-[#6FC847] hover:underline"
          >
            Já tem conta? Faça seu login!
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
