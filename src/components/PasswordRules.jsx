import { MdCheckCircle,MdOutlineErrorOutline  } from "react-icons/md";

export default function PasswordRules({ rules }) {
  return (
    <div className="self-start">
      <h3>A senha deve conter:</h3>
      <ul className="ml-2 w-fit">
        <li className="flex items-center gap-1">{rules.minLength ? <MdCheckCircle fill="#71CC47"/> : <MdOutlineErrorOutline fill="red"/>} Mínimo de 8 caracteres</li>
        <li className="flex items-center gap-1">{rules.hasUppercase ? <MdCheckCircle fill="#71CC47" /> : <MdOutlineErrorOutline fill="red"/>} Letra maiúscula</li>
        <li className="flex items-center gap-1">{rules.hasLowercase ? <MdCheckCircle fill="#71CC47" /> : <MdOutlineErrorOutline fill="red"/>} Letra minúscula</li>
        <li className="flex items-center gap-1">{rules.hasNumber ? <MdCheckCircle fill="#71CC47" /> : <MdOutlineErrorOutline fill="red"/>} Número</li>
        <li className="flex items-center gap-1">{rules.hasSpecialChar ? <MdCheckCircle fill="#71CC47" /> : <MdOutlineErrorOutline fill="red"/>} Caractere especial <i>(ex. #,!,&)</i></li>
      </ul>
    </div>
  );
}
