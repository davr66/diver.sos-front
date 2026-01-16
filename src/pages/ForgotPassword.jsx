import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Field from "../components/Field";
import { validateEmail } from "../utils/Validation";
import { useState } from "react";
import Feedback from "../components/Feedback";
import { forgotPassword } from "../services/api";


export default function ForgotPassword() {
  const passFooter = (<Link className="underline font-medium" to={'/login'}>Voltar para o login</Link>);
  const [form, setForm] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [feedbackOnClose, setFeedbackOnClose] = useState(() => () => setShowFeedback(false));
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [requestedEmail, setRequestedEmail] = useState("");

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    // validações básicas
    if (!form.email) newErrors.email = "Email obrigatório";
    if (!(validateEmail(form.email))) newErrors.email = "Digite um email válido";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(form.email);
      setRequestedEmail(form.email);
      setShowEmailModal(true);
    } catch (err) {
      setFeedback({
        type: 'error',
        heading: 'Erro ao solicitar redefinição',
        message: err?.response?.data?.message || 'Não foi possível enviar o email de redefinição. Tente novamente.',
        duration: 4000
      });
      setShowFeedback(true);
      setFeedbackOnClose(() => () => setShowFeedback(false));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center bg-[var(--profile-bg)] min-h-full">
      <img className="w-[50%] max-w-[18rem] h-auto mt-10 mb-3" src="./src/assets/logo.svg" alt="Logo da diver.sos" />
      <AuthForm heading={'Recuperar senha'} onSubmit={handleSubmit} requiredStyle={false} btnText={'Enviar'} btnLoadingText={'Enviando...'} loading={loading} footer={passFooter}>
        <p className="text-sm">Informe seu endereço de email que nós enviaremos um link para a redefinição de senha.</p>
        <Field label={'Email'}
          value={form.email}
          type="email"
          placeholder={'exemplo@email.com'}
          onChange={handleChange('email')}
          error={errors.email} />
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

      {showEmailModal && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 z-40" onClick={() => setShowEmailModal(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fce3' }}>
                  <svg className="w-12 h-12" fill="#71CC47" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Solicitação enviada!</h2>
              <p className="text-gray-600 mb-2">Se existir uma conta com este email, enviaremos um link para redefinir sua senha:</p>
              <p className="font-semibold text-gray-800 mb-6 break-words">{requestedEmail}</p>
              <p className="text-gray-600 mb-6">Verifique sua caixa de entrada (e spam) e clique no link para definir uma nova senha.</p>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                }}
                className="w-full bg-[#71CC47] hover:bg-[#5ba339] border-2 border-b-3 border-r-3 px-4 py-2 rounded-md font-semibold"
              >
                Ok
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}