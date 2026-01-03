import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";


export default function ForgotPassword(){
  const passFooter = (<Link className="underline font-medium" to={'/login'}>Voltar para o login</Link>);
  return(
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={'Recuperar senha'} requiredStyle={false} btnText={'Enviar'} footer={passFooter}>
        <p className="text-sm">Informe seu endereço de email que nós enviaremos um link para a redefinição de senha.</p>
        <Field label={'Email'} type="email" placeholder={'exemplo@email.com'}/>
      </AuthForm>
    </div>
  );
}