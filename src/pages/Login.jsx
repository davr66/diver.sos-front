import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button";
import { useForm } from "../hooks/useForm";
import { validateEmail, validateRequired } from "../utils/Validation";

export default function Login({ onNavigate, onLogin }) {
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
  });
  const [showPassword, setShowPassword] = useState(false);

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
      if (
        values.email === "usuario@exemplo.com" &&
        values.password === "senha123"
      ) {
        setSuccess("Login realizado com sucesso!");
        setTimeout(() => {
          onLogin({ name: "Usuário Exemplo", email: values.email });
        }, 1000);
      } else {
        setError("Email ou senha incorretos");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout error={error} success={success}>
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Bem-vindo!
      </h1>

      <div className="space-y-5">
        <InputField
          label="E-mail"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          placeholder="Digite seu email"
          icon={Mail}
          disabled={loading}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />

        <InputField
          label="Senha"
          type={showPassword ? "text" : "password"}
          value={values.password}
          onChange={handleChange("password")}
          placeholder="Digite sua senha"
          icon={Lock}
          disabled={loading}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
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

        {/* Link "Esqueceu a senha?" com margem negativa para ficar mais próximo do input */}
        <div className="text-right -mt-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("forgot");
            }}
            className="text-sm font-medium text-violet-600 hover:text-violet-500 hover:underline"
          >
            Esqueceu a senha?
          </a>
        </div>

        <Button onClick={handleSubmit} loading={loading}>
          Entrar
        </Button>

        {/* Link "Criar conta" */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Não tem uma conta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("register");
            }}
            className="font-medium text-violet-600 hover:text-violet-500 hover:underline"
          >
            Criar conta
          </a>
        </p>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> usuario@exemplo.com / senha123
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
