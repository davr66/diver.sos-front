import PasswordRules from "../components/PasswordRules";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import { useState } from "react";
import { Link } from 'react-router-dom';

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

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // validações básicas
    if (!form.name) newErrors.name = "Nome obrigatório";
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

    console.log("Cadastro válido:", form);
  }

  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-screen">
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
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