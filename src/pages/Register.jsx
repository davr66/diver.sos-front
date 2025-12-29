import PasswordRules from "../components/PasswordRules";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import { useState } from "react";

export default function Register(){
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

  return(
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <img className="w-[50%] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={"Acesse sua Conta"} onSubmit={handleSubmit} btnText={"Cadastrar"}>
        <Field
          label="Nome"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <Field
          label="Email"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
          type="email"
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