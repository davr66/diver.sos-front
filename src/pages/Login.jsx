import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";


export default function Login() {
  const loginFooter = (<div className="flex flex-col items-center gap-1"><Link className="underline font-medium" to={'/esqueci-a-senha'}>Esqueci minha senha</Link><p className="font-medium">Não tem conta? <Link className="font-bold underline" to={'/cadastro'}>Crie agora</Link></p></div>);
  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={'Acesse sua conta'} requiredStyle={false} btnText={'Entrar'} footer={loginFooter}>
        <Field label={'Email'} type="email" placeholder={'exemplo@email.com'} />
        <Field label={'Senha'} type="password" />
      </AuthForm>
    </div>
  );
}