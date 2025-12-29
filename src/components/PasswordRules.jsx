export default function PasswordRules({ rules }) {
  return (
    <div className="self-start">
      <h3>A senha deve conter:</h3>
      <ul className="ml-4">
        <li>{rules.minLength ? "✔" : "✖"} Mínimo de 8 caracteres</li>
        <li>{rules.hasUppercase ? "✔" : "✖"} Letra maiúscula</li>
        <li>{rules.hasLowercase ? "✔" : "✖"} Letra minúscula</li>
        <li>{rules.hasNumber ? "✔" : "✖"} Número</li>
        <li>{rules.hasSpecialChar ? "✔" : "✖"} Caractere especial</li>
      </ul>
    </div>
  );
}
